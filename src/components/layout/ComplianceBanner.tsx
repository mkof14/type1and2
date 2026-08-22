import React from 'react';
import type { Language } from '../../types';
import { COMPLIANCE_DISCLAIMER } from '../../content/compliance-disclaimer';
import type { T1DTheme } from '../../lib/t1d-ui';

type ComplianceBannerProps = {
  lang: Language;
  theme: T1DTheme;
  compact?: boolean;
};

export const ComplianceBanner: React.FC<ComplianceBannerProps> = ({ lang, theme, compact = false }) => {
  const copy = COMPLIANCE_DISCLAIMER[lang];

  return (
    <aside
      className={[
        't1d-compliance-banner',
        compact ? 't1d-compliance-banner--compact' : '',
        theme === 'dark' ? 't1d-compliance-banner--dark' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="note"
    >
      <p className="t1d-compliance-banner__title">{copy.bannerTitle}</p>
      <p className="t1d-compliance-banner__body">{copy.bannerBody}</p>
      {!compact ? (
        <ul className="t1d-compliance-banner__list">
          {copy.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
};
