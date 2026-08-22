import React from 'react';
import type { Language } from '../../types';
import { AUTH_TYPE_COPY } from '../../content/access-copy';
import type { SignupDiabetesChoice } from '../../lib/signup-diabetes-type';
import type { T1DTheme } from '../../lib/t1d-ui';

type AuthTypeSelectorProps = {
  lang: Language;
  theme: T1DTheme;
  value: SignupDiabetesChoice | null;
  onChange: (type: SignupDiabetesChoice) => void;
  isRTL?: boolean;
};

const CHOICES = ['type1', 'type2', 'both'] as const;

export const AuthTypeSelector: React.FC<AuthTypeSelectorProps> = ({
  lang,
  theme,
  value,
  onChange,
  isRTL = false,
}) => {
  const copy = AUTH_TYPE_COPY[lang];

  return (
    <div className="t1d-auth-type" dir={isRTL ? 'rtl' : 'ltr'}>
      <p className={`t1d-auth-type__label ${theme === 'dark' ? 't1d-auth-type__label--dark' : ''}`}>{copy.label}</p>
      <p className={`t1d-auth-type__hint ${theme === 'dark' ? 't1d-auth-type__hint--dark' : ''}`}>{copy.hint}</p>
      <div className={`t1d-auth-type__grid t1d-auth-type__grid--triple ${isRTL ? 't1d-auth-type__grid--rtl' : ''}`}>
        {CHOICES.map((choice) => {
          const active = value === choice;
          const item = copy[choice];
          const toneClass = choice === 'type1'
            ? 't1d-auth-type__option--t1'
            : choice === 'type2'
              ? 't1d-auth-type__option--t2'
              : 't1d-auth-type__option--both';
          return (
            <button
              key={choice}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(choice)}
              className={[
                't1d-auth-type__option',
                toneClass,
                active ? 't1d-auth-type__option--active' : '',
                theme === 'dark' ? 't1d-auth-type__option--dark' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="t1d-auth-type__badge">{item.badge}</span>
              <span className="t1d-auth-type__title">{item.title}</span>
              <span className="t1d-auth-type__body">{item.body}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
