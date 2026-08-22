import React from 'react';
import type { DiabetesType, Language } from '../../types';
import type { T1DTheme } from '../../lib/t1d-ui';
import { MEMBER_CHROME_COPY } from '../../content/member-chrome-copy';
import { MEMBER_PATH_COPY } from '../../content/member-path-copy';

type MemberZoneStripProps = {
  lang: Language;
  theme: T1DTheme;
  isRTL?: boolean;
  diabetesType?: DiabetesType | null;
};

export const MemberZoneStrip: React.FC<MemberZoneStripProps> = ({
  lang,
  theme,
  isRTL = false,
  diabetesType = null,
}) => {
  const copy = MEMBER_CHROME_COPY[lang];
  const pathBadge = diabetesType ? MEMBER_PATH_COPY[lang].badge[diabetesType] : null;
  const tone = theme === 'dark' ? 't1d-member-zone-strip--dark' : 't1d-member-zone-strip--light';
  const typeTone = diabetesType ? `t1d-member-zone-strip--${diabetesType}` : 't1d-member-zone-strip--neutral';

  return (
    <div
      className={`t1d-member-zone-strip ${tone} ${typeTone}`}
      role="status"
      aria-label={`${copy.zoneBadge}. ${copy.zoneScope}. ${copy.zoneLead}`}
    >
      <div className={`t1d-container flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <div className={`flex flex-wrap items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="t1d-member-zone-badge">{copy.zoneBadge}</span>
          <span className="t1d-member-scope-badge">{copy.zoneScope}</span>
          {pathBadge ? (
            <span className={`t1d-member-type-badge t1d-member-type-badge--${diabetesType} ${theme === 'dark' ? 't1d-member-type-badge--dark' : ''}`}>
              {pathBadge}
            </span>
          ) : null}
        </div>
        <p className="t1d-member-zone-strip__lead">{copy.zoneLead}</p>
      </div>
    </div>
  );
};

export const memberHeroEyebrow = (lang: Language, diabetesType?: DiabetesType | null) => {
  const chrome = MEMBER_CHROME_COPY[lang];
  if (!diabetesType) return `${chrome.zoneBadge} · ${chrome.zoneScope}`;
  return `${chrome.zoneBadge} · ${MEMBER_PATH_COPY[lang].badge[diabetesType]}`;
};
