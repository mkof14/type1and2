import React, { useEffect, useState } from 'react';
import type { AdminAuth, AdminEmailTemplate } from '../../lib/api';
import {
  getAdminAnalytics,
  getAdminEmailTemplates,
  getAdminFinance,
  getAdminHouseholds,
  getAdminInvitations,
  getAdminMarketingAssets,
  getAdminMonitoring,
  getAdminPermissions,
  getAdminSettings,
  getAdminSummary,
  getAdminSupport,
} from '../../lib/api';
import {
  ADMIN_FALLBACK_ANALYTICS,
  ADMIN_FALLBACK_EMAIL_TEMPLATES,
  ADMIN_FALLBACK_FINANCE,
  ADMIN_FALLBACK_INVITATIONS,
  ADMIN_FALLBACK_MARKETING,
  ADMIN_FALLBACK_MONITORING,
  ADMIN_FALLBACK_PERMISSIONS,
  ADMIN_FALLBACK_SETTINGS,
  ADMIN_FALLBACK_SUMMARY,
  ADMIN_FALLBACK_SUPPORT,
} from '../../lib/admin-fallback-data';
import { ADMIN_NAV } from '../../content/admin-copy';
import type { AdminSectionId } from '../../lib/admin-routing';
import { AdminAssetActions } from './AdminAssetActions';
import { AdminLoadShell, useAdminLoad } from './AdminLoadShell';
import { AdminBarChart, AdminEmptyHint, AdminExpandSection, AdminPageHeader, AdminPanel, AdminStatCard } from './AdminUi';
import { t1dBtnPrimary, t1dBtnSecondary, t1dHelpText, type T1DTheme } from '../../lib/t1d-ui';

type PageProps = { theme: T1DTheme; auth: AdminAuth };

const fmtMoney = (n: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);

const StatusPill: React.FC<{ value: string }> = ({ value }) => (
  <span className={`t1d-admin-pill t1d-admin-pill--${value.replace(/\s+/g, '-')}`}>{value}</span>
);

const HOUSEHOLDS_FALLBACK = {
  ok: true,
  total: 3,
  items: [
    { id: 'hh-1', householdName: 'Rivera Safety Circle', diabetesType: 'type1', stage: 'monitoring', responderState: 'no_responder', alertsCount: 1, dexcomStatus: 'connected', updatedAt: new Date().toISOString() },
    { id: 'hh-2', householdName: 'Chen Type 2 Path', diabetesType: 'type2', stage: 'recovery_watch', responderState: 'parent_active', alertsCount: 2, dexcomStatus: 'delayed', updatedAt: new Date().toISOString() },
    { id: 'hh-3', householdName: 'Lee Family', diabetesType: 'type1', stage: 'monitoring', responderState: 'no_responder', alertsCount: 0, dexcomStatus: 'disconnected', updatedAt: new Date().toISOString() },
  ],
};

export const AdminOverviewPage: React.FC<PageProps> = ({ theme, auth }) => {
  const summary = useAdminLoad({ auth, loader: getAdminSummary, fallback: ADMIN_FALLBACK_SUMMARY });
  const households = useAdminLoad({ auth, loader: (a) => getAdminHouseholds(a, 30), fallback: HOUSEHOLDS_FALLBACK });

  return (
    <div className="t1d-admin-page">
      <AdminPageHeader theme={theme} eyebrow={ADMIN_NAV.overview.group} title={ADMIN_NAV.overview.label} description={ADMIN_NAV.overview.description}
        actions={<button type="button" className={t1dBtnPrimary(theme)} onClick={() => { summary.reload(); households.reload(); }}>Refresh</button>}
      />
      <AdminLoadShell theme={theme} loading={summary.loading && households.loading} error={summary.error || households.error} usingFallback={summary.usingFallback || households.usingFallback} onRetry={() => { summary.reload(); households.reload(); }}>
        {summary.data ? (
          <>
            <div className="t1d-admin-stat-grid">
              <AdminStatCard theme={theme} label="Households" value={summary.data.kv.households} hint="Active member circles" />
              <AdminStatCard theme={theme} label="Users" value={summary.data.kv.users} hint="Registered accounts" />
              <AdminStatCard theme={theme} label="Active alerts" value={summary.data.kv.activeAlerts} hint="In-progress safety cycles" />
              <AdminStatCard theme={theme} label="Storage" value={summary.data.storage} hint="Primary data backend" />
            </div>
            <div className="t1d-admin-grid-2">
              <AdminPanel theme={theme} title="Runtime">
                <div className="t1d-admin-stat-grid t1d-admin-stat-grid--compact">
                  <AdminStatCard theme={theme} label="SQL read" value={summary.data.sqlRead} />
                  <AdminStatCard theme={theme} label="Rate limit" value={summary.data.rateLimit} />
                  <AdminStatCard theme={theme} label="Dexcom live" value={summary.data.dexcomLive ? 'yes' : 'no'} />
                  <AdminStatCard theme={theme} label="Alert rules" value={summary.data.alertRuleVersion} />
                </div>
              </AdminPanel>
              <AdminPanel theme={theme} title="Recommendations">
                <ul className={`list-disc space-y-1 pl-5 ${t1dHelpText(theme)}`}>
                  {(summary.data.recommendations.length ? summary.data.recommendations : ['All clear']).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </AdminPanel>
            </div>
          </>
        ) : null}
        {households.data ? (
          <AdminPanel theme={theme} title={`Households (${households.data.items.length}/${households.data.total})`}>
            {households.data.items.length === 0 ? (
              <AdminEmptyHint theme={theme}>No households yet — first signup will appear here.</AdminEmptyHint>
            ) : (
              <div className="t1d-admin-table-wrap">
                <table className="t1d-admin-table">
                  <thead><tr><th>Name</th><th>Type</th><th>Stage</th><th>Dexcom</th><th>Alerts</th></tr></thead>
                  <tbody>
                    {households.data.items.map((item) => (
                      <tr key={item.id}><td>{item.householdName}</td><td>{item.diabetesType}</td><td>{item.stage}</td><td>{item.dexcomStatus}</td><td>{item.alertsCount}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AdminPanel>
        ) : null}
      </AdminLoadShell>
    </div>
  );
};

export const AdminSupportPage: React.FC<PageProps> = ({ theme, auth }) => {
  const load = useAdminLoad({ auth, loader: getAdminSupport, fallback: ADMIN_FALLBACK_SUPPORT });
  const open = load.data?.tickets.filter((t) => t.status === 'open').length ?? 0;
  const pending = load.data?.tickets.filter((t) => t.status === 'pending').length ?? 0;

  return (
    <div className="t1d-admin-page">
      <AdminPageHeader theme={theme} eyebrow={ADMIN_NAV.support.group} title={ADMIN_NAV.support.label} description={ADMIN_NAV.support.description} actions={<button type="button" className={t1dBtnSecondary(theme)} onClick={load.reload}>Refresh</button>} />
      <AdminLoadShell theme={theme} {...load} onRetry={load.reload}>
        <div className="t1d-admin-stat-grid t1d-admin-stat-grid--compact">
          <AdminStatCard theme={theme} label="Open" value={open} />
          <AdminStatCard theme={theme} label="Pending" value={pending} />
          <AdminStatCard theme={theme} label="Total queue" value={load.data?.tickets.length ?? 0} />
          <AdminStatCard theme={theme} label="SLA target" value="< 4h" hint="First response" />
        </div>
        <AdminPanel theme={theme} title="Support queue">
          {load.data?.tickets.map((ticket) => (
            <div key={ticket.id} className="t1d-admin-list-row">
              <div>
                <strong>{ticket.id}</strong> · {ticket.subject}
                <p className={t1dHelpText(theme)}>{ticket.user} · {new Date(ticket.updatedAt).toLocaleString()}</p>
              </div>
              <div className="t1d-admin-list-row__meta"><StatusPill value={ticket.priority} /><StatusPill value={ticket.status} /></div>
            </div>
          ))}
        </AdminPanel>
        <AdminPanel theme={theme} title="Response templates">
          <p className={t1dHelpText(theme)}>Use Email templates → Support — ticket reply for branded responses. Assign tickets from the queue above.</p>
        </AdminPanel>
      </AdminLoadShell>
    </div>
  );
};

export const AdminSettingsPage: React.FC<PageProps> = ({ theme, auth }) => {
  const load = useAdminLoad({ auth, loader: getAdminSettings, fallback: ADMIN_FALLBACK_SETTINGS });
  const s = load.data?.settings;

  return (
    <div className="t1d-admin-page">
      <AdminPageHeader theme={theme} eyebrow={ADMIN_NAV.settings.group} title={ADMIN_NAV.settings.label} description={ADMIN_NAV.settings.description} actions={<button type="button" className={t1dBtnSecondary(theme)} onClick={load.reload}>Refresh</button>} />
      <AdminLoadShell theme={theme} {...load} onRetry={load.reload}>
        {s ? (
          <div className="t1d-admin-grid-2">
            <AdminPanel theme={theme} title="Site"><dl className="t1d-admin-dl">{Object.entries(s.site).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></AdminPanel>
            <AdminPanel theme={theme} title="Email"><dl className="t1d-admin-dl">{Object.entries(s.email).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{String(v)}</dd></div>)}</dl></AdminPanel>
            <AdminPanel theme={theme} title="Security"><dl className="t1d-admin-dl">{Object.entries(s.security).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{String(v)}</dd></div>)}</dl></AdminPanel>
            <AdminPanel theme={theme} title="Feature flags"><dl className="t1d-admin-dl">{Object.entries(s.features).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{String(v)}</dd></div>)}</dl></AdminPanel>
          </div>
        ) : null}
      </AdminLoadShell>
    </div>
  );
};

export const AdminPermissionsPage: React.FC<PageProps> = ({ theme, auth }) => {
  const load = useAdminLoad({ auth, loader: getAdminPermissions, fallback: ADMIN_FALLBACK_PERMISSIONS });

  return (
    <div className="t1d-admin-page">
      <AdminPageHeader theme={theme} eyebrow={ADMIN_NAV.permissions.group} title={ADMIN_NAV.permissions.label} description={ADMIN_NAV.permissions.description} actions={<button type="button" className={t1dBtnSecondary(theme)} onClick={load.reload}>Refresh</button>} />
      <AdminLoadShell theme={theme} {...load} onRetry={load.reload}>
        <div className="t1d-admin-grid-2">
          <AdminPanel theme={theme} title="Roles">
            {load.data?.roles.map((role) => (
              <div key={role.id} className="t1d-admin-list-row">
                <div><strong>{role.label}</strong><p className={t1dHelpText(theme)}>{role.description}</p></div>
                <StatusPill value={role.id} />
              </div>
            ))}
          </AdminPanel>
          <AdminPanel theme={theme} title="Admin users">
            {load.data?.admins.map((admin) => (
              <div key={admin.id} className="t1d-admin-list-row">
                <div><strong>{admin.name}</strong><p className={t1dHelpText(theme)}>{admin.email} · {admin.scopes.join(', ')}</p></div>
                <StatusPill value={admin.role} />
              </div>
            ))}
          </AdminPanel>
        </div>
      </AdminLoadShell>
    </div>
  );
};

export const AdminInvitationsPage: React.FC<PageProps> = ({ theme, auth }) => {
  const load = useAdminLoad({ auth, loader: getAdminInvitations, fallback: ADMIN_FALLBACK_INVITATIONS });

  return (
    <div className="t1d-admin-page">
      <AdminPageHeader theme={theme} eyebrow={ADMIN_NAV.invitations.group} title={ADMIN_NAV.invitations.label} description={ADMIN_NAV.invitations.description} actions={<button type="button" className={t1dBtnSecondary(theme)} onClick={load.reload}>Refresh</button>} />
      <AdminLoadShell theme={theme} {...load} onRetry={load.reload}>
        <div className="t1d-admin-stat-grid t1d-admin-stat-grid--compact">
          <AdminStatCard theme={theme} label="Active campaigns" value={load.data?.campaigns.filter((c) => c.status === 'active').length ?? 0} />
          <AdminStatCard theme={theme} label="Scheduled sends" value={load.data?.campaigns.reduce((n, c) => n + c.scheduled, 0) ?? 0} />
          <AdminStatCard theme={theme} label="Sent this month" value={load.data?.campaigns.reduce((n, c) => n + c.sent, 0) ?? 0} />
        </div>
        <AdminPanel theme={theme} title="Campaigns">
          {load.data?.campaigns.map((c) => (
            <div key={c.id} className="t1d-admin-list-row">
              <div><strong>{c.name}</strong><p className={t1dHelpText(theme)}>{c.audience} · template {c.templateId}</p></div>
              <div className="t1d-admin-list-row__meta"><StatusPill value={c.status} /><span>sent {c.sent} · sched {c.scheduled}</span></div>
            </div>
          ))}
        </AdminPanel>
      </AdminLoadShell>
    </div>
  );
};

export const AdminMarketingPage: React.FC<PageProps> = ({ theme, auth }) => {
  const load = useAdminLoad({ auth, loader: getAdminMarketingAssets, fallback: ADMIN_FALLBACK_MARKETING });

  return (
    <div className="t1d-admin-page">
      <AdminPageHeader theme={theme} eyebrow={ADMIN_NAV.marketing.group} title={ADMIN_NAV.marketing.label} description={ADMIN_NAV.marketing.description} actions={<button type="button" className={t1dBtnSecondary(theme)} onClick={load.reload}>Refresh</button>} />
      <AdminLoadShell theme={theme} {...load} onRetry={load.reload}>
        <div className="t1d-admin-card-grid">
          {load.data?.items.map((asset) => (
            <article key={asset.id} className={`t1d-admin-card ${theme === 'dark' ? 't1d-admin-card--dark' : ''}`}>
              <p className="t1d-admin-card__kind">{asset.kind} · {asset.format}</p>
              <h3 className="t1d-admin-card__title">{asset.title}</h3>
              <p className={t1dHelpText(theme)}>{asset.description}</p>
              <p className="t1d-admin-card__meta">{asset.size} · {new Date(asset.updatedAt).toLocaleDateString()}</p>
              <AdminAssetActions theme={theme} title={asset.title} content={`${asset.title}\n${asset.description}\n${asset.url}`} url={asset.url} filename={asset.id} html={`<h1>${asset.title}</h1><p>${asset.description}</p><a href="${asset.url}">${asset.url}</a>`} />
            </article>
          ))}
        </div>
      </AdminLoadShell>
    </div>
  );
};

export const AdminEmailTemplatesPage: React.FC<PageProps> = ({ theme, auth }) => {
  const load = useAdminLoad({ auth, loader: getAdminEmailTemplates, fallback: ADMIN_FALLBACK_EMAIL_TEMPLATES });
  const [active, setActive] = useState<AdminEmailTemplate | null>(null);
  useEffect(() => { if (load.data?.items[0] && !active) setActive(load.data.items[0]); }, [load.data, active]);

  return (
    <div className="t1d-admin-page">
      <AdminPageHeader theme={theme} eyebrow={ADMIN_NAV['email-templates'].group} title={ADMIN_NAV['email-templates'].label} description={ADMIN_NAV['email-templates'].description} actions={<button type="button" className={t1dBtnSecondary(theme)} onClick={load.reload}>Refresh</button>} />
      <AdminLoadShell theme={theme} {...load} onRetry={load.reload}>
        <div className="t1d-admin-template-layout">
          <div className="t1d-admin-template-list">
            {load.data?.items.map((template) => (
              <button key={template.id} type="button" className={`t1d-admin-template-item ${active?.id === template.id ? 't1d-admin-template-item--active' : ''}`} onClick={() => setActive(template)}>
                <strong>{template.name}</strong>
                <span>{template.category}</span>
              </button>
            ))}
          </div>
          {active ? (
            <div className="t1d-admin-template-preview">
              <div className="t1d-admin-template-preview__head">
                <div><h3>{active.name}</h3><p className={t1dHelpText(theme)}>{active.subject}</p><p className={t1dHelpText(theme)} style={{ marginTop: '0.35rem', fontSize: '0.78rem' }}>{active.preheader}</p></div>
                <AdminAssetActions theme={theme} compact title={active.name} content={active.html} html={active.html} filename={active.id} />
              </div>
              <div className="t1d-admin-template-preview__canvas">
                <iframe title={active.name} className="t1d-admin-template-preview__frame" srcDoc={active.html} sandbox="allow-same-origin" />
              </div>
            </div>
          ) : null}
        </div>
      </AdminLoadShell>
    </div>
  );
};

export const AdminMonitoringPage: React.FC<PageProps> = ({ theme, auth }) => {
  const load = useAdminLoad({ auth, loader: getAdminMonitoring, fallback: ADMIN_FALLBACK_MONITORING });
  const m = load.data?.monitoring;

  return (
    <div className="t1d-admin-page">
      <AdminPageHeader theme={theme} eyebrow={ADMIN_NAV.monitoring.group} title={ADMIN_NAV.monitoring.label} description={ADMIN_NAV.monitoring.description} actions={<button type="button" className={t1dBtnSecondary(theme)} onClick={load.reload}>Refresh</button>} />
      <AdminLoadShell theme={theme} {...load} onRetry={load.reload}>
        {m ? (
          <>
            <div className="t1d-admin-stat-grid">
              <AdminStatCard theme={theme} label="Uptime" value={m.uptime} />
              <AdminStatCard theme={theme} label="API latency" value={`${m.apiLatencyMs}ms`} />
              <AdminStatCard theme={theme} label="Error rate" value={`${m.errorRate}%`} />
              <AdminStatCard theme={theme} label="Storage" value={m.storage} />
            </div>
            <div className="t1d-admin-grid-2">
              <AdminPanel theme={theme} title="Background jobs">
                <dl className="t1d-admin-dl">{Object.entries(m.backgroundJobs).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
              </AdminPanel>
              <AdminPanel theme={theme} title="Environment">
                <dl className="t1d-admin-dl">{Object.entries(m.env).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
              </AdminPanel>
            </div>
            <AdminPanel theme={theme} title="Operational alerts">
              <ul className={`list-disc space-y-1 pl-5 ${t1dHelpText(theme)}`}>
                {(m.alerts.length ? m.alerts : ['No active alerts']).map((item) => <li key={item}>{item}</li>)}
              </ul>
            </AdminPanel>
          </>
        ) : null}
      </AdminLoadShell>
    </div>
  );
};

export const AdminAnalyticsPage: React.FC<PageProps> = ({ theme, auth }) => {
  const load = useAdminLoad({ auth, loader: getAdminAnalytics, fallback: ADMIN_FALLBACK_ANALYTICS });

  return (
    <div className="t1d-admin-page">
      <AdminPageHeader theme={theme} eyebrow={ADMIN_NAV.analytics.group} title={ADMIN_NAV.analytics.label} description={ADMIN_NAV.analytics.description} actions={<button type="button" className={t1dBtnSecondary(theme)} onClick={load.reload}>Refresh</button>} />
      <AdminLoadShell theme={theme} {...load} onRetry={load.reload}>
        {load.data ? (
          <>
            <div className="t1d-admin-stat-grid">
              <AdminStatCard theme={theme} label="Visitors today" value={load.data.visitors.today} />
              <AdminStatCard theme={theme} label="Visitors month" value={load.data.visitors.month} />
              <AdminStatCard theme={theme} label="Signups month" value={load.data.signups.month} />
              <AdminStatCard theme={theme} label="Conversion" value={`${load.data.conversionRate}%`} />
            </div>
            <div className="t1d-admin-grid-2">
              <AdminBarChart theme={theme} title="Traffic by channel" items={load.data.channels.map((row, i) => ({
                label: row.channel, value: row.visits, color: ['#6366f1', '#06b6d4', '#f59e0b', '#10b981', '#ec4899'][i % 5],
              }))} />
              <AdminBarChart theme={theme} title="Signups by channel" items={load.data.channels.map((row, i) => ({
                label: row.channel, value: row.signups, color: ['#8b5cf6', '#14b8a6', '#f97316', '#22c55e', '#f43f5e'][i % 5],
              }))} />
            </div>
            <AdminPanel theme={theme} title="Channel breakdown">
              <div className="t1d-admin-table-wrap"><table className="t1d-admin-table"><thead><tr><th>Channel</th><th>Visits</th><th>Signups</th><th>Share</th></tr></thead><tbody>
                {load.data.channels.map((row) => <tr key={row.channel}><td>{row.channel}</td><td>{row.visits}</td><td>{row.signups}</td><td>{row.share}%</td></tr>)}
              </tbody></table></div>
            </AdminPanel>
            {load.data.campaigns?.length ? (
              <AdminPanel theme={theme} title="Email campaign performance">
                <div className="t1d-admin-table-wrap"><table className="t1d-admin-table"><thead><tr><th>Campaign</th><th>Sent</th><th>Opened</th><th>Clicked</th><th>Converted</th></tr></thead><tbody>
                  {load.data.campaigns.map((c) => <tr key={c.id}><td>{c.name}</td><td>{c.sent}</td><td>{c.opened}</td><td>{c.clicked}</td><td>{c.converted}</td></tr>)}
                </tbody></table></div>
              </AdminPanel>
            ) : null}
          </>
        ) : null}
      </AdminLoadShell>
    </div>
  );
};

export const AdminFinancePage: React.FC<PageProps> = ({ theme, auth }) => {
  const load = useAdminLoad({ auth, loader: getAdminFinance, fallback: ADMIN_FALLBACK_FINANCE });

  return (
    <div className="t1d-admin-page">
      <AdminPageHeader theme={theme} eyebrow={ADMIN_NAV.finance.group} title={ADMIN_NAV.finance.label} description={ADMIN_NAV.finance.description} actions={<button type="button" className={t1dBtnSecondary(theme)} onClick={load.reload}>Refresh</button>} />
      <AdminLoadShell theme={theme} {...load} onRetry={load.reload}>
        {load.data ? (
          <>
            <p className={`mb-4 ${t1dHelpText(theme)}`}>{load.data.note}</p>
            <div className="t1d-admin-grid-2">
              <AdminBarChart theme={theme} title="Revenue snapshot" items={[
                { label: 'Today', value: load.data.revenue.today, color: '#6366f1' },
                { label: 'Month', value: load.data.revenue.month, color: '#06b6d4' },
                { label: 'Year', value: load.data.revenue.year, color: '#10b981' },
                { label: 'All time', value: load.data.revenue.allTime, color: '#f59e0b' },
              ]} />
              <AdminBarChart theme={theme} title="Subscriber mix" items={[
                { label: 'Paid', value: load.data.subscribers.paid, color: '#0ea5e9' },
                { label: 'Trial', value: load.data.subscribers.trial, color: '#a855f7' },
                { label: 'Free', value: load.data.subscribers.free, color: '#94a3b8' },
                { label: 'Churned', value: load.data.subscribers.churned, color: '#f43f5e' },
              ]} />
            </div>
            <AdminPanel theme={theme} title="Plans">
              <div className="t1d-admin-table-wrap"><table className="t1d-admin-table"><thead><tr><th>Plan</th><th>Price</th><th>Interval</th></tr></thead><tbody>
                {load.data.plans.map((p) => <tr key={p.id}><td>{p.name}</td><td>{fmtMoney(p.price)}</td><td>{p.interval}</td></tr>)}
              </tbody></table></div>
            </AdminPanel>
            <AdminExpandSection theme={theme} title="Users" summary={`${load.data.users.total} total`} defaultOpen>
              <div className="t1d-admin-stat-grid t1d-admin-stat-grid--compact">
                <AdminStatCard theme={theme} label="Today" value={load.data.users.today} />
                <AdminStatCard theme={theme} label="Month" value={load.data.users.month} />
                <AdminStatCard theme={theme} label="Year" value={load.data.users.year} />
                <AdminStatCard theme={theme} label="All time" value={load.data.users.total} />
              </div>
            </AdminExpandSection>
            <AdminPanel theme={theme} title="Recent transactions">
              <div className="t1d-admin-table-wrap"><table className="t1d-admin-table"><thead><tr><th>Type</th><th>User</th><th>Amount</th><th>Reason</th></tr></thead><tbody>
                {load.data.transactions.map((tx) => <tr key={tx.id}><td>{tx.type}</td><td>{tx.user}</td><td>{fmtMoney(tx.amount)}</td><td>{tx.reason}</td></tr>)}
              </tbody></table></div>
            </AdminPanel>
          </>
        ) : null}
      </AdminLoadShell>
    </div>
  );
};

export const AdminSectionRouter: React.FC<PageProps & { section: AdminSectionId }> = ({ section, ...props }) => {
  switch (section) {
    case 'overview': return <AdminOverviewPage {...props} />;
    case 'support': return <AdminSupportPage {...props} />;
    case 'settings': return <AdminSettingsPage {...props} />;
    case 'permissions': return <AdminPermissionsPage {...props} />;
    case 'invitations': return <AdminInvitationsPage {...props} />;
    case 'marketing': return <AdminMarketingPage {...props} />;
    case 'email-templates': return <AdminEmailTemplatesPage {...props} />;
    case 'monitoring': return <AdminMonitoringPage {...props} />;
    case 'analytics': return <AdminAnalyticsPage {...props} />;
    case 'finance': return <AdminFinancePage {...props} />;
    default: return <AdminOverviewPage {...props} />;
  }
};
