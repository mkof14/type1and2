import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { ADMIN_ACTIONS, ADMIN_NAV } from '../../content/admin-copy';
import { ADMIN_SECTIONS, adminPathForSection, type AdminSectionId } from '../../lib/admin-routing';
import type { T1DTheme } from '../../lib/t1d-ui';

type AdminSidebarProps = {
  theme: T1DTheme;
  active: AdminSectionId;
  onNavigate: (section: AdminSectionId) => void;
  onBackToPublic: () => void;
};

const groups = ['Operations', 'People', 'Growth', 'Insights', 'Platform'] as const;

const groupAccent: Record<(typeof groups)[number], string> = {
  Operations: 'ops',
  People: 'people',
  Growth: 'growth',
  Insights: 'insights',
  Platform: 'platform',
};

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ theme, active, onNavigate, onBackToPublic }) => (
  <aside className={`t1d-admin-sidebar ${theme === 'dark' ? 't1d-admin-sidebar--dark' : ''}`}>
    <button type="button" className="t1d-admin-back-site" onClick={onBackToPublic}>
      <ArrowLeft size={16} aria-hidden />
      <span>{ADMIN_ACTIONS.backToSite}</span>
    </button>
    <div className="t1d-admin-sidebar__brand">
      <BrandLogo variant="full" density="header" />
      <p className="t1d-admin-sidebar__eyebrow">{ADMIN_ACTIONS.consoleEyebrow}</p>
      <p className="t1d-admin-sidebar__title">{ADMIN_ACTIONS.consoleTitle}</p>
    </div>
    <nav className="t1d-admin-sidebar__nav" aria-label="Admin sections">
      {groups.map((group) => {
        const items = ADMIN_SECTIONS.filter((id) => ADMIN_NAV[id].group === group);
        if (items.length === 0) return null;
        return (
          <div key={group} className={`t1d-admin-sidebar__group t1d-admin-sidebar__group--${groupAccent[group]}`}>
            <p className="t1d-admin-sidebar__group-label">{group}</p>
            <ul className="t1d-admin-sidebar__list">
              {items.map((id) => (
                <li key={id}>
                  <button
                    type="button"
                    className={`t1d-admin-sidebar__link ${active === id ? 't1d-admin-sidebar__link--active' : ''}`}
                    onClick={() => onNavigate(id)}
                    aria-current={active === id ? 'page' : undefined}
                  >
                    {ADMIN_NAV[id].label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
    <div className="t1d-admin-sidebar__footer">
      <p className="t1d-admin-sidebar__path">{adminPathForSection(active)}</p>
    </div>
  </aside>
);
