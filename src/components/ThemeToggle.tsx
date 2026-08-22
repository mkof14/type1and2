import React from 'react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggle: () => void;
  activateLightLabel: string;
  activateDarkLabel: string;
  switchToLightTitle: string;
  switchToDarkTitle: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  toggle,
  activateLightLabel,
  activateDarkLabel,
  switchToLightTitle,
  switchToDarkTitle,
}) => {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? activateLightLabel : activateDarkLabel}
      title={isDark ? switchToLightTitle : switchToDarkTitle}
      className="t1d-theme-toggle outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isDark ? 'text-amber-200/90' : 'text-amber-700/90'}
        aria-hidden="true"
      >
        {isDark ? (
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </>
        )}
      </svg>
    </button>
  );
};

export default ThemeToggle;
