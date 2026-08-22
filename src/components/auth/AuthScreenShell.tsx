import React from 'react';
import { BrandLogo } from '../BrandLogo';
import type { DiabetesType, Language } from '../../types';
import { AUTH_TYPE_COPY } from '../../content/access-copy';
import { DIABETES_TYPE_COPY, diabetesTypeKey } from '../../content/diabetes-type-copy';
import type { SignupDiabetesChoice } from '../../lib/signup-diabetes-type';
import { LanguageSelector } from '../LanguageSelector';
import ThemeToggle from '../ThemeToggle';
import { typeAccentBarClass } from '../../lib/diabetes-type-theme';
import { LegalFootnote } from '../layout/LegalFootnote';
import type { AccessMode } from '../../content/access-copy';
import { t1dBtnGhost, type T1DTheme } from '../../lib/t1d-ui';

interface AuthScreenShellProps {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: T1DTheme;
  setTheme: (theme: 'light' | 'dark') => void;
  diabetesType?: DiabetesType | null;
  signupChoice?: SignupDiabetesChoice | null;
  isRTL: boolean;
  mode?: AccessMode;
  onBack?: () => void;
  backLabel?: string;
  children: React.ReactNode;
}

export const AuthScreenShell: React.FC<AuthScreenShellProps> = ({
  lang,
  setLang,
  theme,
  setTheme,
  diabetesType = null,
  signupChoice = null,
  isRTL,
  onBack,
  backLabel,
  children,
}) => {
  const shellClass = theme === 'dark'
    ? 'min-h-screen t1d-page-shell t1d-page-shell--dark t1d-page-shell--public t1d-auth-screen text-slate-100'
    : 'min-h-screen t1d-page-shell t1d-page-shell--public t1d-auth-screen t1d-auth-screen--light text-stone-900';

  const typeLabel = diabetesType
    ? DIABETES_TYPE_COPY[lang][diabetesTypeKey(diabetesType)].label
    : null;
  const bothCopy = signupChoice === 'both' ? AUTH_TYPE_COPY[lang].both : null;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`${shellClass} relative flex flex-col`}>
      {diabetesType ? <div className={typeAccentBarClass(diabetesType, theme)} /> : null}
      {signupChoice === 'both' && !diabetesType ? (
        <div className={`t1d-accent-bar ${theme === 'dark' ? 't1d-accent-bar--dark' : ''} t1d-accent-bar--both`} />
      ) : null}
      <div className={`t1d-auth-screen__top flex items-center justify-between gap-3 px-4 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {onBack ? (
          <button type="button" onClick={onBack} className={t1dBtnGhost(theme)}>
            {backLabel || '←'}
          </button>
        ) : <span />}
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <LanguageSelector
            current={lang}
            onSelect={setLang}
            label={lang === 'ru' ? 'Язык' : 'Language'}
            buttonLabel={lang === 'ru' ? 'Язык' : 'Language'}
            rtl={isRTL}
          />
          <ThemeToggle
            theme={theme}
            toggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            activateLightLabel={lang === 'ru' ? 'Светлая тема' : 'Light mode'}
            activateDarkLabel={lang === 'ru' ? 'Тёмная тема' : 'Dark mode'}
            switchToLightTitle={lang === 'ru' ? 'Светлая тема' : 'Light mode'}
            switchToDarkTitle={lang === 'ru' ? 'Тёмная тема' : 'Dark mode'}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-4 pb-6 pt-2">
        <div className="mb-5 w-full max-w-md">
          <BrandLogo variant="full" density="auth-xl" isRTL={isRTL} />
          {typeLabel ? (
            <div className={`mt-4 flex justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className={`t1d-auth-type-pill ${diabetesType === 'type2' ? 't1d-auth-type-pill--t2' : 't1d-auth-type-pill--t1'} ${theme === 'dark' ? 't1d-auth-type-pill--dark' : ''}`}>
                {diabetesType === 'type1' ? 'TYPE 1' : 'TYPE 2'} · {typeLabel}
              </span>
            </div>
          ) : bothCopy ? (
            <div className={`mt-4 flex justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className={`t1d-auth-type-pill t1d-auth-type-pill--both ${theme === 'dark' ? 't1d-auth-type-pill--dark' : ''}`}>
                {bothCopy.badge} · {bothCopy.title}
              </span>
            </div>
          ) : null}
        </div>
        <div className="w-full max-w-md">
          {children}
        </div>
        <div className="mt-auto w-full max-w-md pt-8">
          <LegalFootnote lang={lang} theme={theme} />
        </div>
      </div>
    </div>
  );
};
