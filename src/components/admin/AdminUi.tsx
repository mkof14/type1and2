import React from 'react';
import type { T1DTheme } from '../../lib/t1d-ui';
import { t1dCardHeading, t1dDisplayTitle, t1dEyebrow, t1dHelpText } from '../../lib/t1d-ui';

type AdminPageHeaderProps = {
  theme: T1DTheme;
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
};

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ theme, eyebrow, title, description, actions }) => (
  <header className="t1d-admin-page-header">
    <div>
      <p className={t1dEyebrow(theme)}>{eyebrow}</p>
      <h1 className={t1dDisplayTitle()}>{title}</h1>
      <p className={`mt-2 max-w-3xl ${t1dHelpText(theme)}`}>{description}</p>
    </div>
    {actions ? <div className="t1d-admin-page-header__actions">{actions}</div> : null}
  </header>
);

export const AdminStatCard: React.FC<{ theme: T1DTheme; label: string; value: string | number; hint?: string }> = ({
  theme,
  label,
  value,
  hint,
}) => (
  <div className={`t1d-admin-stat ${theme === 'dark' ? 't1d-admin-stat--dark' : ''}`}>
    <p className="t1d-admin-stat__label">{label}</p>
    <p className="t1d-admin-stat__value">{value}</p>
    {hint ? <p className="t1d-admin-stat__hint">{hint}</p> : null}
  </div>
);

export const AdminPanel: React.FC<{ theme: T1DTheme; title: string; children: React.ReactNode; className?: string }> = ({
  theme,
  title,
  children,
  className = '',
}) => (
  <section className={`t1d-admin-panel ${theme === 'dark' ? 't1d-admin-panel--dark' : ''} ${className}`}>
    <h2 className={t1dCardHeading()}>{title}</h2>
    {children}
  </section>
);

export const AdminExpandSection: React.FC<{ theme: T1DTheme; title: string; summary: string; children: React.ReactNode; defaultOpen?: boolean }> = ({
  theme,
  title,
  summary,
  children,
  defaultOpen = false,
}) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <details className={`t1d-admin-expand ${theme === 'dark' ? 't1d-admin-expand--dark' : ''}`} open={open}>
      <summary className="t1d-admin-expand__summary" onClick={(e) => { e.preventDefault(); setOpen(!open); }}>
        <span>
          <strong>{title}</strong>
          <span className="t1d-admin-expand__meta">{summary}</span>
        </span>
        <span aria-hidden>{open ? '−' : '+'}</span>
      </summary>
      <div className="t1d-admin-expand__body">{children}</div>
    </details>
  );
};

export const AdminBarChart: React.FC<{ theme: T1DTheme; title: string; items: Array<{ label: string; value: number; color?: string }> }> = ({
  theme,
  title,
  items,
}) => {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className={`t1d-admin-bars ${theme === 'dark' ? 't1d-admin-bars--dark' : ''}`}>
      <p className="t1d-admin-bars__title">{title}</p>
      <ul className="t1d-admin-bars__list">
        {items.map((item) => (
          <li key={item.label} className="t1d-admin-bars__row">
            <span className="t1d-admin-bars__label">{item.label}</span>
            <span className="t1d-admin-bars__track">
              <span className="t1d-admin-bars__fill" style={{ width: `${(item.value / max) * 100}%`, background: item.color || 'linear-gradient(90deg,#6366f1,#06b6d4)' }} />
            </span>
            <span className="t1d-admin-bars__value">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const AdminPageBanner: React.FC<{ theme: T1DTheme; tone: 'info' | 'warn' | 'error'; children: React.ReactNode }> = ({
  theme,
  tone,
  children,
}) => (
  <div className={`t1d-admin-banner t1d-admin-banner--${tone} ${theme === 'dark' ? 't1d-admin-banner--dark' : ''}`}>{children}</div>
);

export const AdminEmptyHint: React.FC<{ theme: T1DTheme; children: React.ReactNode }> = ({ theme, children }) => (
  <p className={`t1d-admin-empty ${t1dHelpText(theme)}`}>{children}</p>
);
