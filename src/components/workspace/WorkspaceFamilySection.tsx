import React from 'react';
import { Copy, Check } from 'lucide-react';
import type { HouseholdProfile } from '../../lib/api';
import { DIABETES_TYPE_COPY, diabetesTypeKey } from '../../content/diabetes-type-copy';
import { HOUSEHOLD_COPY } from '../../content/workspace-panel-copy';
import { typeCardClass } from '../../lib/diabetes-type-theme';
import { t1dSoftLabel } from '../../lib/t1d-ui';
import type { Language } from '../../types';
import { WorkspaceSectionHeader } from './WorkspaceSectionHeader';

interface WorkspaceFamilyCopy {
  childCard: string;
  primaryParent: string;
  caregiver: string;
}

interface WorkspaceFamilySectionProps {
  lang: Language;
  theme: 'light' | 'dark';
  isRTL: boolean;
  household: HouseholdProfile;
  primaryPanelClass: string;
  workspaceSectionShell: string;
  subtlePanelClass: string;
  softLabelClass: string;
  sectionTitle: string;
  sectionSubtitle: string;
  copy: WorkspaceFamilyCopy;
  inviteCopy: {
    title: string;
    body: string;
    copyLabel: string;
    copied: string;
  };
  roleLabels: Record<'parent' | 'adult' | 'caregiver', string>;
  inviteCopied: boolean;
  onCopyInviteCode: () => void;
}

export const WorkspaceFamilySection: React.FC<WorkspaceFamilySectionProps> = ({
  lang,
  theme,
  isRTL,
  household,
  primaryPanelClass,
  workspaceSectionShell,
  subtlePanelClass,
  softLabelClass,
  sectionTitle,
  sectionSubtitle,
  copy,
  inviteCopy,
  roleLabels,
  inviteCopied,
  onCopyInviteCode,
}) => {
  const householdCopy = HOUSEHOLD_COPY[lang];
  const diabetesTypeLabel = DIABETES_TYPE_COPY[lang][diabetesTypeKey(household.diabetesType)];
  const dark = theme === 'dark';

  return (
    <section className={`${primaryPanelClass} ${workspaceSectionShell} t1d-family-section ${dark ? 't1d-family-section--dark' : ''} ${isRTL ? 'text-right' : 'text-left'}`}>
      <WorkspaceSectionHeader title={sectionTitle} subtitle={sectionSubtitle} theme={theme} isRTL={isRTL} />

      <div className="t1d-family-stack">
        <div className={`${typeCardClass(household.diabetesType, theme)} t1d-family-card t1d-family-card--type`}>
          <p className={softLabelClass}>{DIABETES_TYPE_COPY[lang].field}</p>
          <p className="t1d-family-card__title">{diabetesTypeLabel.label}</p>
          <p className="t1d-family-card__body">{diabetesTypeLabel.description}</p>
        </div>

        <div className={`${subtlePanelClass} t1d-family-card`}>
          <p className={softLabelClass}>{copy.childCard}</p>
          <p className="t1d-family-card__title">{household.childName} · {household.childAgeBand}</p>
          <p className="t1d-family-card__meta">{copy.primaryParent}: {household.primaryParent}</p>
          {household.caregiverName ? (
            <p className="t1d-family-card__meta">{copy.caregiver}: {household.caregiverName}</p>
          ) : null}
        </div>
      </div>

      <div className="t1d-family-grid">
        <div className={`${subtlePanelClass} t1d-family-card t1d-family-card--invite`}>
          <p className="t1d-family-card__heading">{inviteCopy.title}</p>
          <p className="t1d-family-card__body">{inviteCopy.body}</p>
          <div className="t1d-family-invite">
            <code className="t1d-invite-code" title={household.inviteCode || undefined}>
              {household.inviteCode || '------'}
            </code>
            <button
              type="button"
              onClick={onCopyInviteCode}
              className={`t1d-family-copy-btn ${inviteCopied ? 't1d-family-copy-btn--copied' : ''} ${dark ? 't1d-family-copy-btn--dark' : 't1d-family-copy-btn--light'}`}
            >
              {inviteCopied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
              <span>{inviteCopied ? inviteCopy.copied : inviteCopy.copyLabel}</span>
            </button>
          </div>
        </div>

        <div className={`${subtlePanelClass} t1d-family-card t1d-family-card--members`}>
          <p className={softLabelClass}>{householdCopy.members}</p>
          <div className="t1d-family-members">
            {household.members.map((member) => (
              <article
                key={member.id}
                className={`t1d-family-member-card ${dark ? 't1d-family-member-card--dark' : 't1d-family-member-card--light'}`}
              >
                <div className="t1d-family-member-card__head">
                  <p className="t1d-family-member-card__name" title={member.fullName}>{member.fullName}</p>
                  <span className={`t1d-family-member-card__status ${member.status === 'active' ? 'is-active' : 'is-pending'}`}>
                    {member.status === 'active' ? householdCopy.active : householdCopy.invited}
                  </span>
                </div>
                <p className="t1d-family-member-card__role">{roleLabels[member.role]}</p>
                <p className="t1d-family-member-card__email" title={member.email || undefined}>{member.email || '—'}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
