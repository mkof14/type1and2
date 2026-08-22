import { useCallback, useEffect, useRef, useState } from 'react';
import type { Language } from '../types';
import { detectIntent, speechLang } from '../lib/voice-guide-engine';
import { applyDoctorVoice, preloadSpeechVoices } from '../lib/speech-voice';
import type { ChatMessage } from './useTypewriter';
import type { VoiceGuideMode } from '../content/voice-guide-copy';

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

const getRecognition = (): SpeechRecognitionInstance | null => {
  if (typeof window === 'undefined') return null;
  const w = window as Window & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
};

export type VoiceGuideAction = { type: 'member_section' | 'public_page'; id: string };

export const useVoiceGuide = ({
  lang,
  mode,
  onAction,
}: {
  lang: Language;
  mode: VoiceGuideMode;
  onAction?: (action: VoiceGuideAction) => void;
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [micEnabled, setMicEnabled] = useState(mode === 'full');
  const [speakerEnabled, setSpeakerEnabled] = useState(mode === 'full');
  const [audioLevels, setAudioLevels] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const speakPulseRef = useRef<number | null>(null);

  const stopMeter = useCallback(() => {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (speakPulseRef.current) window.clearInterval(speakPulseRef.current);
    speakPulseRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    analyserRef.current = null;
    if (audioCtxRef.current?.state !== 'closed') void audioCtxRef.current?.close();
    audioCtxRef.current = null;
    setAudioLevels([0, 0, 0, 0, 0, 0, 0, 0]);
  }, []);

  const runMeter = useCallback((analyser: AnalyserNode) => {
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const chunk = 8;
      const levels = Array.from({ length: chunk }, (_, i) => {
        const start = Math.floor((i / chunk) * data.length);
        const end = Math.floor(((i + 1) / chunk) * data.length);
        let sum = 0;
        for (let j = start; j < end; j += 1) sum += data[j];
        const avg = sum / Math.max(1, end - start);
        return Math.min(1, avg / 140);
      });
      setAudioLevels(levels);
      rafRef.current = window.requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const startMicMeter = useCallback(async () => {
    if (mode !== 'full' || !micEnabled) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      runMeter(analyser);
    } catch {
      /* mic permission denied */
    }
  }, [micEnabled, mode, runMeter]);

  const speakPulse = useCallback(() => {
    speakPulseRef.current = window.setInterval(() => {
      setAudioLevels(Array.from({ length: 8 }, () => 0.25 + Math.random() * 0.65));
    }, 90);
  }, []);

  const speak = useCallback((text: string) => {
    if (mode !== 'full' || !speakerEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = speechLang(lang);
    applyDoctorVoice(utter, lang);
    utter.onstart = () => {
      setSpeaking(true);
      stopMeter();
      speakPulse();
    };
    utter.onend = () => {
      setSpeaking(false);
      if (speakPulseRef.current) window.clearInterval(speakPulseRef.current);
      setAudioLevels([0, 0, 0, 0, 0, 0, 0, 0]);
      if (listening) void startMicMeter();
    };
    window.speechSynthesis.speak(utter);
  }, [lang, listening, mode, speakerEnabled, speakPulse, startMicMeter, stopMeter]);

  const pushAssistant = useCallback((text: string, _intent?: string, action?: VoiceGuideAction) => {
    const id = `a-${Date.now()}`;
    setMessages((prev) => [...prev, { id, role: 'assistant', text, typing: true }]);
    if (action) onAction?.(action);
    speak(text);
    window.setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, typing: false } : m)));
    }, Math.min(text.length * 18, 4000));
  }, [onAction, speak]);

  const sendMessage = useCallback((raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text }]);
    setInput('');
    const reply = detectIntent(text, lang);
    pushAssistant(reply.text, reply.intent, reply.action);
  }, [lang, pushAssistant]);

  const toggleListen = useCallback(() => {
    if (mode !== 'full' || !micEnabled) return;
    const recognition = getRecognition();
    if (!recognition) return;

    if (listening) {
      recognition.stop();
      setListening(false);
      stopMeter();
      return;
    }

    recognitionRef.current = recognition;
    recognition.lang = speechLang(lang);
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || '';
      if (transcript) sendMessage(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    setListening(true);
    void startMicMeter();
    recognition.start();
  }, [lang, listening, micEnabled, mode, sendMessage, startMicMeter, stopMeter]);

  useEffect(() => () => {
    recognitionRef.current?.stop();
    stopMeter();
    window.speechSynthesis?.cancel();
  }, [stopMeter]);

  const boot = useCallback(() => {
    if (messages.length) return;
    const reply = detectIntent('', lang);
    setMessages([{ id: 'boot', role: 'assistant', text: reply.text, typing: true }]);
    window.setTimeout(() => {
      setMessages([{ id: 'boot', role: 'assistant', text: reply.text, typing: false }]);
    }, reply.text.length * 14);
  }, [lang, messages.length]);

  useEffect(() => { boot(); }, [boot]);

  useEffect(() => {
    preloadSpeechVoices();
  }, []);

  return {
    messages,
    input,
    setInput,
    sendMessage,
    listening,
    speaking,
    micEnabled,
    setMicEnabled,
    speakerEnabled,
    setSpeakerEnabled,
    toggleListen,
    audioLevels,
    canVoice: mode === 'full' && Boolean(getRecognition()),
  };
};
