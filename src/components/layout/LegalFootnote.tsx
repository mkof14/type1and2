import React from 'react';
import type { Language } from '../../types';
import { COMPLIANCE_DISCLAIMER } from '../../content/compliance-disclaimer';
import type { T1DTheme } from '../../lib/t1d-ui';

type LegalFootnoteProps = {
  lang: Language;
  theme: T1DTheme;
};

/** Quiet legal note — page bottom only, no beta badge. */
export const LegalFootnote: React.FC<LegalFootnoteProps> = ({ lang, theme }) => (
  <p
    className={`t1d-page-footnote ${theme === 'dark' ? 't1d-page-footnote--dark' : ''}`}
    role="note"
  >
    {COMPLIANCE_DISCLAIMER[lang].footer}
  </p>
);
