import React from 'react';
import type { Language } from '../../types';
import type { T1DTheme } from '../../lib/t1d-ui';
import { VOICE_GUIDE_COPY } from '../../content/voice-guide-copy';
import { VoiceGuideWidget } from '../voice/VoiceGuideWidget';
import { WorkspaceSectionHeader } from './WorkspaceSectionHeader';
import type { VoiceGuideAction } from '../../hooks/useVoiceGuide';

type VoiceGuidePanelProps = {
  lang: Language;
  theme: T1DTheme;
  isRTL?: boolean;
  sectionTitle: string;
  onAction?: (action: VoiceGuideAction) => void;
};

export const VoiceGuidePanel: React.FC<VoiceGuidePanelProps> = ({
  lang,
  theme,
  isRTL = false,
  sectionTitle,
  onAction,
}) => {
  const copy = VOICE_GUIDE_COPY[lang];
  return (
    <section className={`t1d-voice-panel ${theme === 'dark' ? 't1d-voice-panel--dark' : ''} ${isRTL ? 'text-right' : 'text-left'}`}>
      <WorkspaceSectionHeader title={sectionTitle} subtitle={copy.sectionSubtitle} theme={theme} isRTL={isRTL} />
      <VoiceGuideWidget lang={lang} theme={theme} mode="full" isRTL={isRTL} onAction={onAction} />
    </section>
  );
};
