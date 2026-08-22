import type { Language } from '../types';
import { speechLang } from './voice-guide-engine';

const DOCTOR_VOICE_HINTS = [
  'natural',
  'premium',
  'enhanced',
  'neural',
  'samantha',
  'alex',
  'daniel',
  'karen',
  'sergey',
  'milena',
  'google',
  'microsoft',
];

const AVOID_VOICE_HINTS = ['compact', 'robot', 'espeak', 'super-compact', 'cellos'];

const scoreVoice = (name: string, langPrefix: string): number => {
  const lower = name.toLowerCase();
  if (AVOID_VOICE_HINTS.some((hint) => lower.includes(hint))) return -4;
  let score = 0;
  if (DOCTOR_VOICE_HINTS.some((hint) => lower.includes(hint))) score += 3;
  if (lower.includes('male') || lower.includes('female')) score += 1;
  if (lower.includes(langPrefix)) score += 2;
  return score;
};

export const applyDoctorVoice = (utterance: SpeechSynthesisUtterance, lang: Language): void => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices();
  const target = speechLang(lang);
  const prefix = target.slice(0, 2).toLowerCase();
  const ranked = voices
    .filter((voice) => voice.lang.toLowerCase().startsWith(prefix))
    .sort((a, b) => scoreVoice(b.name, prefix) - scoreVoice(a.name, prefix));
  const picked = ranked[0] ?? voices.find((voice) => voice.lang.toLowerCase().startsWith(prefix));
  if (picked) utterance.voice = picked;
  utterance.lang = target;
  utterance.rate = 0.92;
  utterance.pitch = 0.94;
};

export const preloadSpeechVoices = (): void => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    window.speechSynthesis.getVoices();
  }, { once: true });
};
