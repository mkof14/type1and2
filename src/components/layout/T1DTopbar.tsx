import React from 'react';
import type { Language } from '../../types';
import type { CorePage } from '../../content/landing-copy';
import LanguageSelector from '../LanguageSelector';
import ThemeToggle from '../ThemeToggle';
import { BrandLogo } from '../BrandLogo';
import { MEMBER_CHROME_COPY } from '../../content/member-chrome-copy';
import { MEMBER_PATH_COPY } from '../../content/member-path-copy';
import type { DiabetesType } from '../../types';
import type { T1DTheme } from '../../lib/t1d-ui';
import { t1dBtnNav } from '../../lib/t1d-ui';

interface T1DTopbarProps {
  lang: Language;
  theme: T1DTheme;
  isRTL: boolean;
  brand: string;
  nav: Record<CorePage, string>;
  headerPages: CorePage[];
  activePage?: CorePage | null;
  accountLabel: string;
  onAccountAction: () => void;
  onBrandClick: () => void;
  onNavigate: (page: CorePage) => void;
  setLang: (lang: Language) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  uiCopy: {
    selectLanguage: string;
    changeLanguage: string;
    activateLightMode: string;
    activateDarkMode: string;
    switchToLightMode: string;
    switchToDarkMode: string;
  };
  diabetesType?: DiabetesType | null;
  showMemberZone?: boolean;
}

export const T1DTopbar: React.FC<T1DTopbarProps> = ({
  lang,
  theme,
  isRTL,
  brand,
  nav,
  headerPages,
  activePage = null,
  accountLabel,
  onAccountAction,
  onBrandClick,
  onNavigate,
  setLang,
  setTheme,
  uiCopy,
  diabetesType = null,
  showMemberZone = false,
}) => {
  const pathBadge = diabetesType ? MEMBER_PATH_COPY[lang].badge[diabetesType] : null;
  const memberCopy = MEMBER_CHROME_COPY[lang];
  const navButtonClass = t1dBtnNav(theme);

  return (
    <header className={`t1d-topbar ${theme === 'dark' ? 't1d-topbar--dark' : ''}`}>
      <div className={`t1d-container h-14 flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button
          type="button"
          onClick={onBrandClick}
          className={`t1d-brand-button flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <BrandLogo variant="full" density="header" isRTL={isRTL} />
          {showMemberZone ? (
            <span className={`t1d-member-zone-badge t1d-member-zone-badge--header ${theme === 'dark' ? 't1d-member-zone-badge--dark' : ''}`}>
              {memberCopy.zoneBadge}
            </span>
          ) : null}
          {showMemberZone ? (
            <span className={`t1d-member-scope-badge t1d-member-scope-badge--header ${theme === 'dark' ? 't1d-member-scope-badge--dark' : ''}`}>
              {memberCopy.zoneScope}
            </span>
          ) : null}
          {pathBadge ? (
            <span className={`t1d-member-type-badge t1d-member-type-badge--${diabetesType} ${theme === 'dark' ? 't1d-member-type-badge--dark' : ''}`}>
              {pathBadge}
            </span>
          ) : null}
        </button>
        <nav className={`t1d-topbar-nav flex min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto px-1 scrollbar-thin md:gap-4 md:justify-start ${isRTL ? 'flex-row-reverse' : ''}`}>
          {headerPages.map((page, index) => (
            <React.Fragment key={page}>
              {index > 0 ? <span className={theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}>·</span> : null}
              <button
                type="button"
                onClick={() => onNavigate(page)}
                className={`shrink-0 whitespace-nowrap text-[0.92rem] transition-colors ${
                  activePage === page
                    ? theme === 'dark'
                      ? 'text-amber-200'
                      : 'text-stone-950'
                    : theme === 'dark'
                      ? 'text-slate-300 hover:text-amber-200'
                      : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {nav[page]}
              </button>
            </React.Fragment>
          ))}
        </nav>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <LanguageSelector
            current={lang}
            onSelect={setLang}
            label={uiCopy.selectLanguage}
            buttonLabel={uiCopy.changeLanguage}
            rtl={isRTL}
          />
          <ThemeToggle
            theme={theme}
            toggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            activateLightLabel={uiCopy.activateLightMode}
            activateDarkLabel={uiCopy.activateDarkMode}
            switchToLightTitle={uiCopy.switchToLightMode}
            switchToDarkTitle={uiCopy.switchToDarkMode}
          />
          <button type="button" onClick={onAccountAction} className={navButtonClass}>
            {accountLabel}
          </button>
        </div>
      </div>
    </header>
  );
};
