import React from 'react';
import {
  Activity,
  BellRing,
  Clock3,
  FileHeart,
  History,
  Link2,
  Settings2,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import { VoiceGuideMark } from '../voice/VoiceGuideMark';
import type { DiabetesType, Language } from '../../types';
import type { T1DTheme } from '../../lib/t1d-ui';
import { resolveWorkspaceNav } from '../../lib/workspace-content';
import { workspaceNavTypeClass } from '../../lib/diabetes-type-theme';
import { WORKSPACE_SECTION_ORDER, type WorkspaceSectionId } from '../../content/workspace-nav-copy';

const GuideNavIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <VoiceGuideMark size={size + 4} className={className} />
);

const SECTION_ICON: Record<WorkspaceSectionId, React.ComponentType<{ size?: number; className?: string }>> = {
  now: Activity,
  nutrition: UtensilsCrossed,
  timeline: Clock3,
  system: Link2,
  'health-records': FileHeart,
  alerts: BellRing,
  settings: Settings2,
  family: Users,
  history: History,
  guide: GuideNavIcon,
};

const SECTION_TONE: Record<WorkspaceSectionId, string> = {
  now: 'mint',
  nutrition: 'orange',
  timeline: 'slate',
  system: 'sky',
  'health-records': 'teal',
  alerts: 'amber',
  settings: 'violet',
  family: 'rose',
  history: 'slate',
  guide: 'violet',
};

const NAV_GROUPS: Record<Language, { id: string; label: string; sections: WorkspaceSectionId[] }[]> = {
  en: [
    { id: 'today', label: 'Today', sections: ['now', 'nutrition', 'timeline'] },
    { id: 'connect', label: 'Connect', sections: ['system'] },
    { id: 'household', label: 'Household', sections: ['alerts', 'settings', 'family', 'history', 'guide'] },
  ],
  ru: [
    { id: 'today', label: 'Сегодня', sections: ['now', 'nutrition', 'timeline'] },
    { id: 'connect', label: 'Связь', sections: ['system'] },
    { id: 'household', label: 'Дом', sections: ['alerts', 'settings', 'family', 'history', 'guide'] },
  ],
  uk: [
    { id: 'today', label: 'Сьогодні', sections: ['now', 'nutrition', 'timeline'] },
    { id: 'connect', label: "Зв'язок", sections: ['system'] },
    { id: 'household', label: 'Дім', sections: ['alerts', 'settings', 'family', 'history', 'guide'] },
  ],
  es: [
    { id: 'today', label: 'Hoy', sections: ['now', 'nutrition', 'timeline'] },
    { id: 'connect', label: 'Conexión', sections: ['system'] },
    { id: 'household', label: 'Hogar', sections: ['alerts', 'settings', 'family', 'history', 'guide'] },
  ],
  fr: [
    { id: 'today', label: "Aujourd'hui", sections: ['now', 'nutrition', 'timeline'] },
    { id: 'connect', label: 'Connexion', sections: ['system'] },
    { id: 'household', label: 'Foyer', sections: ['alerts', 'settings', 'family', 'history', 'guide'] },
  ],
  de: [
    { id: 'today', label: 'Heute', sections: ['now', 'nutrition', 'timeline'] },
    { id: 'connect', label: 'Verbindung', sections: ['system'] },
    { id: 'household', label: 'Haushalt', sections: ['alerts', 'settings', 'family', 'history', 'guide'] },
  ],
  zh: [
    { id: 'today', label: '今天', sections: ['now', 'nutrition', 'timeline'] },
    { id: 'connect', label: '连接', sections: ['system'] },
    { id: 'household', label: '家庭', sections: ['alerts', 'settings', 'family', 'history', 'guide'] },
  ],
  ja: [
    { id: 'today', label: '今日', sections: ['now', 'nutrition', 'timeline'] },
    { id: 'connect', label: '接続', sections: ['system'] },
    { id: 'household', label: '世帯', sections: ['alerts', 'settings', 'family', 'history', 'guide'] },
  ],
  pt: [
    { id: 'today', label: 'Hoje', sections: ['now', 'nutrition', 'timeline'] },
    { id: 'connect', label: 'Conexão', sections: ['system'] },
    { id: 'household', label: 'Casa', sections: ['alerts', 'settings', 'family', 'history', 'guide'] },
  ],
  he: [
    { id: 'today', label: 'היום', sections: ['now', 'nutrition', 'timeline'] },
    { id: 'connect', label: 'חיבור', sections: ['system'] },
    { id: 'household', label: 'בית', sections: ['alerts', 'settings', 'family', 'history', 'guide'] },
  ],
  ar: [
    { id: 'today', label: 'اليوم', sections: ['now', 'nutrition', 'timeline'] },
    { id: 'connect', label: 'الاتصال', sections: ['system'] },
    { id: 'household', label: 'الأسرة', sections: ['alerts', 'settings', 'family', 'history', 'guide'] },
  ],
};

export type WorkspaceSidebarProps = {
  active: WorkspaceSectionId;
  onSelect: (section: WorkspaceSectionId) => void;
  theme: T1DTheme;
  lang: Language;
  diabetesType?: DiabetesType;
  isRTL?: boolean;
  horizontal?: boolean;
  sensorConnected?: boolean;
  clinicConnectedCount?: number;
};

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  active,
  onSelect,
  theme,
  lang,
  diabetesType = 'type1',
  isRTL = false,
  horizontal = false,
  sensorConnected = false,
  clinicConnectedCount = 0,
}) => {
  const nav = resolveWorkspaceNav(lang, diabetesType);
  const tone = theme === 'dark' ? 't1d-workspace-nav--dark' : 't1d-workspace-nav--light';
  const groups = NAV_GROUPS[lang] || NAV_GROUPS.en;
  const visibleSections = new Set(WORKSPACE_SECTION_ORDER);

  const renderItem = (sectionId: WorkspaceSectionId) => {
    if (!visibleSections.has(sectionId)) return null;
    const Icon = SECTION_ICON[sectionId];
    const selected = active === sectionId || (active === 'health-records' && sectionId === 'system');
    const item = nav[sectionId];
    const toneKey = SECTION_TONE[sectionId];
    const showLive = sectionId === 'system' && (sensorConnected || clinicConnectedCount > 0);
    const liveCount = sectionId === 'system'
      ? (sensorConnected ? 1 : 0) + clinicConnectedCount
      : 0;

    return (
      <button
        key={sectionId}
        type="button"
        aria-current={selected ? 'page' : undefined}
        onClick={() => onSelect(sectionId)}
        className={`t1d-workspace-nav__item t1d-workspace-nav__item--tone-${toneKey} ${selected ? 't1d-workspace-nav__item--active' : ''}`}
      >
        <span className="t1d-workspace-nav__icon" aria-hidden="true">
          <Icon size={17} />
        </span>
        <span className="t1d-workspace-nav__copy">
          <span className="t1d-workspace-nav__label-row">
            <span className="t1d-workspace-nav__label">{item.label}</span>
            {showLive ? (
              <span className="t1d-workspace-nav__live" title={`${liveCount} active`}>{liveCount}</span>
            ) : null}
          </span>
          <span className="t1d-workspace-nav__hint">{item.hint}</span>
        </span>
      </button>
    );
  };

  return (
    <nav
      className={`t1d-workspace-nav ${tone} ${workspaceNavTypeClass(diabetesType)} ${horizontal ? 't1d-workspace-nav--horizontal' : ''} ${isRTL ? 't1d-workspace-nav--rtl' : ''}`}
      aria-label={lang === 'ru' ? 'Разделы member zone' : 'Member workspace sections'}
    >
      <div className="t1d-workspace-nav__list">
        {horizontal
          ? WORKSPACE_SECTION_ORDER.map((sectionId) => renderItem(sectionId))
          : groups.map((group) => (
            <div key={group.id} className="t1d-workspace-nav__group">
              <p className="t1d-workspace-nav__group-label">{group.label}</p>
              {group.sections.map((sectionId) => renderItem(sectionId))}
            </div>
          ))}
      </div>
    </nav>
  );
};
