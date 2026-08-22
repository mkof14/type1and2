import React, { useRef, useEffect } from 'react';
import type { Language } from '../../types';
import type { T1DTheme } from '../../lib/t1d-ui';
import { t1dBtnPrimary, t1dBtnSecondary } from '../../lib/t1d-ui';
import { VOICE_GUIDE_COPY, type VoiceGuideMode } from '../../content/voice-guide-copy';
import { useVoiceGuide, type VoiceGuideAction } from '../../hooks/useVoiceGuide';
import { useTypewriter } from '../../hooks/useTypewriter';
import { VoiceGuideMark } from './VoiceGuideMark';
import {
  VoiceMicIcon,
  VoiceMicOffIcon,
  VoiceSendIcon,
  VoiceSpeakerIcon,
  VoiceSpeakerOffIcon,
} from './VoiceGuideControlIcons';

type VoiceGuideWidgetProps = {
  lang: Language;
  theme: T1DTheme;
  mode: VoiceGuideMode;
  isRTL?: boolean;
  onSignIn?: () => void;
  onAction?: (action: VoiceGuideAction) => void;
  compact?: boolean;
};

const TypewriterBubble: React.FC<{ text: string; typing: boolean; theme: T1DTheme }> = ({ text, typing, theme }) => {
  const visible = useTypewriter(text, typing);
  return (
    <p className={`t1d-voice-chat__text ${theme === 'dark' ? 't1d-voice-chat__text--dark' : ''}`}>
      {visible}
      {typing && visible.length < text.length ? <span className="t1d-voice-chat__cursor" aria-hidden>|</span> : null}
    </p>
  );
};

export const VoiceGuideWidget: React.FC<VoiceGuideWidgetProps> = ({
  lang,
  theme,
  mode,
  isRTL = false,
  onSignIn,
  onAction,
  compact = false,
}) => {
  const copy = VOICE_GUIDE_COPY[lang];
  const scrollRef = useRef<HTMLDivElement>(null);
  const guide = useVoiceGuide({ lang, mode, onAction });
  const dark = theme === 'dark';

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [guide.messages]);

  const statusLabel = guide.listening ? copy.listening : guide.speaking ? copy.speaking : copy.idle;

  return (
    <div className={`t1d-voice-guide ${compact ? 't1d-voice-guide--compact' : ''} ${dark ? 't1d-voice-guide--dark' : ''} ${isRTL ? 't1d-voice-guide--rtl' : ''}`}>
      <div className="t1d-voice-guide__persona">
        <VoiceGuideMark size={40} className="t1d-voice-guide__avatar" />
        <div>
          <p className="t1d-voice-guide__persona-name">{copy.guideName}</p>
          <p className="t1d-voice-guide__persona-role">{copy.guideRole}</p>
        </div>
      </div>

      <div className="t1d-voice-guide__toolbar">
        <span className={`t1d-voice-guide__badge ${mode === 'full' ? 'is-full' : 'is-preview'}`}>
          {mode === 'full' ? copy.fullBadge : copy.previewBadge}
        </span>
        <span className="t1d-voice-guide__status">{statusLabel}</span>
      </div>

      <div className="t1d-voice-guide__controls">
        <button
          type="button"
          disabled={mode !== 'full'}
          aria-pressed={guide.micEnabled}
          title={guide.micEnabled ? copy.micOn : copy.micOff}
          className={`t1d-voice-control ${guide.listening ? 't1d-voice-control--live' : ''} ${mode !== 'full' ? 't1d-voice-control--disabled' : ''}`}
          onClick={() => {
            if (mode !== 'full') return;
            if (!guide.micEnabled) guide.setMicEnabled(true);
            guide.toggleListen();
          }}
        >
          {guide.micEnabled && mode === 'full' ? <VoiceMicIcon size={20} /> : <VoiceMicOffIcon size={20} />}
          <span>{copy.micOn}</span>
        </button>

        <div className="t1d-voice-meter" aria-hidden={!guide.listening && !guide.speaking}>
          {guide.audioLevels.map((level, i) => (
            <span key={i} className="t1d-voice-meter__bar" style={{ transform: `scaleY(${0.15 + level})` }} />
          ))}
        </div>

        <button
          type="button"
          disabled={mode !== 'full'}
          aria-pressed={guide.speakerEnabled}
          title={guide.speakerEnabled ? copy.speakerOn : copy.speakerOff}
          className={`t1d-voice-control ${guide.speaking ? 't1d-voice-control--live' : ''} ${mode !== 'full' ? 't1d-voice-control--disabled' : ''}`}
          onClick={() => guide.setSpeakerEnabled((v) => !v)}
        >
          {guide.speakerEnabled && mode === 'full' ? <VoiceSpeakerIcon size={20} /> : <VoiceSpeakerOffIcon size={20} />}
          <span>{copy.speakerOn}</span>
        </button>
      </div>

      {mode === 'preview' ? (
        <p className="t1d-voice-guide__preview-note">{copy.previewLimit}</p>
      ) : null}

      <div className={`t1d-voice-chat-panel ${dark ? 't1d-voice-chat-panel--dark' : ''}`}>
        <div ref={scrollRef} className="t1d-voice-chat">
          {guide.messages.map((msg) => (
            <div key={msg.id} className={`t1d-voice-chat__bubble t1d-voice-chat__bubble--${msg.role} ${dark ? 't1d-voice-chat__bubble--dark' : ''}`}>
              {msg.role === 'assistant' ? (
                <div className="t1d-voice-chat__assistant-row">
                  <VoiceGuideMark size={28} className="t1d-voice-chat__mini-mark" />
                  <TypewriterBubble text={msg.text} typing={Boolean(msg.typing)} theme={theme} />
                </div>
              ) : (
                <p className="t1d-voice-chat__text">{msg.text}</p>
              )}
            </div>
          ))}
        </div>

        <form
          className="t1d-voice-input-row t1d-voice-input-row--prominent"
          onSubmit={(e) => {
            e.preventDefault();
            guide.sendMessage(guide.input);
          }}
        >
          <input
            className={`t1d-voice-input t1d-voice-input--prominent ${dark ? 't1d-voice-input--dark' : ''}`}
            value={guide.input}
            onChange={(e) => guide.setInput(e.target.value)}
            placeholder={copy.placeholder}
            aria-label={copy.placeholder}
          />
          <button type="submit" className={t1dBtnPrimary(theme)} disabled={!guide.input.trim()}>
            <VoiceSendIcon size={16} className="inline mr-1" />
            {copy.send}
          </button>
        </form>
      </div>

      {mode === 'preview' && onSignIn ? (
        <div className="t1d-voice-guide__cta">
          <p className="t1d-voice-guide__cta-hint">{copy.signInHint}</p>
          <button type="button" className={t1dBtnSecondary(theme)} onClick={onSignIn}>{copy.signInCta}</button>
        </div>
      ) : null}
    </div>
  );
};
