import React from 'react';
import type { Language } from '../../types';
import type { SessionUser } from '../../lib/api';
import { MEMBER_SETTINGS_COPY, MEMBER_TIMEZONES } from '../../content/member-settings-copy';
import { t1dBtnPrimary, t1dSoftLabel } from '../../lib/t1d-ui';

export type MemberProfileInput = {
  fullName: string;
  organization: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
};

type MemberProfilePanelProps = {
  lang: Language;
  theme: 'light' | 'dark';
  user: SessionUser;
  profile: MemberProfileInput;
  setProfile: React.Dispatch<React.SetStateAction<MemberProfileInput>>;
  saving: boolean;
  savedNotice: string;
  onSave: () => void;
};

export const MemberProfilePanel: React.FC<MemberProfilePanelProps> = ({
  lang,
  theme,
  user,
  profile,
  setProfile,
  saving,
  savedNotice,
  onSave,
}) => {
  const copy = MEMBER_SETTINGS_COPY[lang];
  const softLabel = t1dSoftLabel(theme);
  const inputClass = `w-full rounded-2xl border px-4 py-3 text-sm font-semibold ${theme === 'dark' ? 'border-slate-800 bg-slate-950/70 text-slate-100' : 'border-slate-200 bg-slate-50/90 text-slate-900'}`;

  return (
    <div className={`t1d-member-profile ${theme === 'dark' ? 't1d-member-profile--dark' : ''}`}>
      <div className="t1d-member-profile__head">
        <h3 className="text-lg font-black">{copy.profileTitle}</h3>
        <p className="mt-1 text-sm opacity-80">{copy.profileSubtitle}</p>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className={softLabel}>{copy.fullName}</span>
          <input className={inputClass} value={profile.fullName} onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))} />
        </label>
        <label className="space-y-2">
          <span className={softLabel}>{copy.email}</span>
          <input className={inputClass} value={user.email} readOnly disabled />
        </label>
        <label className="space-y-2">
          <span className={softLabel}>{copy.organization}</span>
          <input className={inputClass} value={profile.organization} onChange={(e) => setProfile((p) => ({ ...p, organization: e.target.value }))} />
        </label>
        <label className="space-y-2">
          <span className={softLabel}>{copy.timezone}</span>
          <select className={inputClass} value={profile.timezone} onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}>
            {MEMBER_TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-6">
        <h4 className="font-bold">{copy.notificationsTitle}</h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {(['emailNotifications', 'pushNotifications', 'marketingEmails'] as const).map((key) => (
            <label key={key} className={`t1d-member-toggle ${profile[key] ? 't1d-member-toggle--on' : ''}`}>
              <input type="checkbox" checked={profile[key]} onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.checked }))} />
              <span>{copy[key]}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" disabled={saving} onClick={onSave} className={t1dBtnPrimary(theme)}>
          {saving ? copy.savingProfile : copy.saveProfile}
        </button>
        {savedNotice ? <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{savedNotice}</p> : null}
      </div>
    </div>
  );
};

export const profileFromUser = (user: SessionUser): MemberProfileInput => ({
  fullName: user.fullName || '',
  organization: user.organization || '',
  timezone: (user as SessionUser & { timezone?: string }).timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
  emailNotifications: (user as SessionUser & { emailNotifications?: boolean }).emailNotifications !== false,
  pushNotifications: (user as SessionUser & { pushNotifications?: boolean }).pushNotifications !== false,
  marketingEmails: Boolean((user as SessionUser & { marketingEmails?: boolean }).marketingEmails),
});
