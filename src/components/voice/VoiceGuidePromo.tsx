import React from 'react';
import type { Language } from '../../types';
import type { T1DTheme } from '../../lib/t1d-ui';
import { VOICE_GUIDE_COPY } from '../../content/voice-guide-copy';
import { VoiceGuideMark } from './VoiceGuideMark';

type VoiceGuidePromoProps = {
  lang: Language;
  theme: T1DTheme;
  onOpenGuide: () => void;
  onSignIn?: () => void;
};

export const VoiceGuidePromo: React.FC<VoiceGuidePromoProps> = ({ lang, theme, onOpenGuide, onSignIn }) => {
  const copy = VOICE_GUIDE_COPY[lang];
  return (
    <aside className={`t1d-voice-promo ${theme === 'dark' ? 't1d-voice-promo--dark' : ''}`}>
      <VoiceGuideMark size={44} className="t1d-voice-promo__mark" />
      <div>
        <p className="t1d-voice-promo__title">{copy.promoTitle}</p>
        <p className="t1d-voice-promo__role">{copy.guideRole}</p>
        <p className="t1d-voice-promo__body">{copy.promoBody}</p>
      </div>
      <div className="t1d-voice-promo__actions">
        <button type="button" className="t1d-voice-promo__link" onClick={onOpenGuide}>{copy.promoLink}</button>
        {onSignIn ? (
          <button type="button" className="t1d-voice-promo__ghost" onClick={onSignIn}>{copy.signInCta}</button>
        ) : null}
      </div>
    </aside>
  );
};
