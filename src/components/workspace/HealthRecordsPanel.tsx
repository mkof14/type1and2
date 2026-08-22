import React from 'react';
import { Activity, FileHeart, RefreshCw, ShieldCheck, Stethoscope, Unplug } from 'lucide-react';
import type { Language } from '../../types';
import type { HealthRecordsSummary } from '../../lib/api';
import { HEALTH_PORTAL_COPY } from '../../content/health-portal-copy';
import { t1dBtnPrimary, t1dBtnSecondary, t1dSoftLabel, type T1DTheme } from '../../lib/t1d-ui';
import { WorkspaceSectionHeader } from './WorkspaceSectionHeader';

type HealthRecordsPanelProps = {
  lang: Language;
  theme: T1DTheme;
  isRTL?: boolean;
  embedded?: boolean;
  featuredPortalId?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  summary: HealthRecordsSummary;
  busy?: boolean;
  onConnect: (portalId: string) => Promise<void>;
  onSync: (portalId: string) => Promise<void>;
  onDisconnect: (portalId: string) => Promise<void>;
};

const accentClass = (accent: string) => `t1d-health-portal-card--${accent}`;

export const HealthRecordsPanel: React.FC<HealthRecordsPanelProps> = ({
  lang,
  theme,
  isRTL = false,
  embedded = false,
  featuredPortalId = 'epic_mychart',
  sectionTitle,
  sectionSubtitle,
  summary,
  busy = false,
  onConnect,
  onSync,
  onDisconnect,
}) => {
  const copy = HEALTH_PORTAL_COPY[lang];
  const softLabel = t1dSoftLabel(theme);
  const portals = [...summary.portals].sort((a, b) => {
    if (a.id === featuredPortalId) return -1;
    if (b.id === featuredPortalId) return 1;
    return 0;
  });

  const shellClass = embedded
    ? `t1d-health-records-embedded ${theme === 'dark' ? 't1d-health-records-embedded--dark' : ''}`
    : `t1d-health-records ${theme === 'dark' ? 't1d-health-records--dark' : ''} ${isRTL ? 'text-right' : 'text-left'}`;

  return (
    <div className={shellClass}>
      {!embedded && sectionTitle ? (
        <WorkspaceSectionHeader title={sectionTitle} subtitle={sectionSubtitle} theme={theme} isRTL={isRTL} />
      ) : null}

      {!embedded ? (
        <div className={`t1d-health-records__hero ${theme === 'dark' ? 't1d-health-records__hero--dark' : ''}`}>
          <div className="t1d-health-records__hero-copy">
            <p className={softLabel}>{copy.unifiedTitle}</p>
            <h3 className="text-xl font-bold tracking-tight">{copy.unifiedSubtitle}</h3>
            <p className="mt-2 text-sm opacity-85">{copy.portalHint}</p>
          </div>
          <div className="t1d-health-records__hero-stats">
            <div><strong>{summary.connectedCount}</strong><span>{copy.connected}</span></div>
            <div><strong>{summary.totalRecords}</strong><span>{copy.records}</span></div>
          </div>
        </div>
      ) : (
        <div className={`t1d-health-records__inline-stats ${theme === 'dark' ? 't1d-health-records__inline-stats--dark' : ''}`}>
          <span>{summary.connectedCount} {copy.connected.toLowerCase()}</span>
          <span>{summary.totalRecords} {copy.records}</span>
          <span>{summary.liveMode ? copy.liveMode : copy.mockMode}</span>
        </div>
      )}

      <div className="t1d-health-portal-grid">
        {portals.map((portal) => {
          const connected = portal.connection.status === 'connected';
          const featured = portal.id === featuredPortalId;
          return (
            <article
              key={portal.id}
              className={`t1d-health-portal-card ${accentClass(portal.accent)} ${connected ? 't1d-health-portal-card--connected' : ''} ${featured ? 't1d-health-portal-card--featured' : ''}`}
            >
              {featured ? <p className="t1d-health-portal-card__featured-tag">{copy.oauthConnect}</p> : null}
              <div className="t1d-health-portal-card__head">
                <span className="t1d-health-portal-card__icon" aria-hidden><Stethoscope size={featured ? 20 : 18} /></span>
                <div>
                  <h4 className="font-bold">{portal.name}</h4>
                  <p className="text-xs opacity-75">{portal.vendor} · {portal.fhirVersion}</p>
                </div>
                <span className={`t1d-health-portal-card__status ${connected ? 'is-on' : ''}`}>{connected ? copy.connected : copy.disconnected}</span>
              </div>
              <p className="t1d-health-portal-card__types">{portal.recordTypes.map((t) => copy.types[t] || t).join(' · ')}</p>
              {connected ? (
                <p className="text-xs opacity-80">{copy.lastSync}: {portal.connection.lastSyncAt ? new Date(portal.connection.lastSyncAt).toLocaleString() : '—'} · {portal.connection.recordCount} {copy.records}</p>
              ) : null}
              <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {connected ? (
                  <>
                    <button type="button" disabled={busy} className={t1dBtnSecondary(theme)} onClick={() => onSync(portal.id)}>
                      <RefreshCw size={14} className="inline mr-1" />{busy ? copy.syncing : copy.sync}
                    </button>
                    <button type="button" disabled={busy} className={t1dBtnSecondary(theme)} onClick={() => onDisconnect(portal.id)}>
                      <Unplug size={14} className="inline mr-1" />{copy.disconnect}
                    </button>
                  </>
                ) : (
                  <button type="button" disabled={busy} className={t1dBtnPrimary(theme)} onClick={() => onConnect(portal.id)}>
                    {portal.authMode === 'oauth_smart' && featured ? copy.oauthConnect : copy.connect}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className={`t1d-health-timeline ${theme === 'dark' ? 't1d-health-timeline--dark' : ''}`}>
        <div className="t1d-health-timeline__head">
          <FileHeart size={20} />
          <div>
            <h3 className="font-bold">{copy.unifiedTitle}</h3>
            <p className="text-sm opacity-80">{summary.lastSyncAt ? `${copy.lastSync}: ${new Date(summary.lastSyncAt).toLocaleString()}` : copy.noRecords}</p>
          </div>
          <ShieldCheck size={20} className="opacity-70" />
        </div>
        {summary.unifiedTimeline.length === 0 ? (
          <p className="p-5 text-sm opacity-75">{copy.noRecords}</p>
        ) : (
          <ul className="t1d-health-timeline__list">
            {summary.unifiedTimeline.map((record) => (
              <li key={record.id} className="t1d-health-timeline__item">
                <span className="t1d-health-timeline__dot" aria-hidden />
                <div>
                  <p className="font-semibold">{record.title}</p>
                  <p className="text-sm opacity-85">{record.value}{record.unit ? ` ${record.unit}` : ''} · {copy.types[record.type] || record.type}</p>
                  <p className="text-xs opacity-70">{record.source} · {new Date(record.date).toLocaleDateString()}</p>
                </div>
                <Activity size={16} className="opacity-50 shrink-0" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export type { HealthRecordsSummary };
