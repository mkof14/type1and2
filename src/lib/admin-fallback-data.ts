/** Offline fallback when admin API is unreachable — mirrors server seed data. */
import { getEmailTemplates } from '../../server/services/email-templates.mjs';
import type {
  AdminAnalyticsPayload,
  AdminEmailTemplate,
  AdminFinancePayload,
  AdminInvitationsPayload,
  AdminMarketingAsset,
  AdminMonitoringPayload,
  AdminPermissionsPayload,
  AdminSettingsPayload,
  AdminSummaryPayload,
  AdminSupportPayload,
} from './api';

const SITE = typeof window !== 'undefined' ? window.location.origin : 'https://type1and2.com';

export const ADMIN_FALLBACK_SUMMARY: AdminSummaryPayload = {
  ok: true,
  service: 't1d-api',
  timestamp: new Date().toISOString(),
  storage: 'kv',
  sqlRead: 'off',
  rateLimit: 'memory',
  dexcomLive: false,
  alertRuleVersion: 'v2',
  kv: { households: 3, users: 5, activeAlerts: 1, inMemoryNotifications: 4 },
  sql: null,
  recommendations: ['Connect DATABASE_URL for SQL mirror', 'Enable Dexcom live mode for production CGM'],
};

export const ADMIN_FALLBACK_SUPPORT: AdminSupportPayload = {
  ok: true,
  tickets: [
    { id: 'SUP-1042', subject: 'Dexcom connection keeps disconnecting', status: 'open', priority: 'high', user: 'parent@example.com', updatedAt: new Date().toISOString() },
    { id: 'SUP-1041', subject: 'Invite code not working for caregiver', status: 'pending', priority: 'medium', user: 'family@example.com', updatedAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'SUP-1038', subject: 'Question about Type 2 night window', status: 'resolved', priority: 'low', user: 'adult@example.com', updatedAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'SUP-1035', subject: 'MyChart sync not showing labs', status: 'open', priority: 'medium', user: 'member@example.com', updatedAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'SUP-1032', subject: 'Password reset email delayed', status: 'pending', priority: 'low', user: 'user@example.com', updatedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  ],
};

export const ADMIN_FALLBACK_SETTINGS: AdminSettingsPayload = {
  ok: true,
  settings: {
    site: { name: 'Type1 and 2', domain: 'type1and2.com', url: SITE, supportEmail: 'support@type1and2.com', noreplyEmail: 'hello@type1and2.com' },
    email: { provider: 'not_configured', inviteEnabled: true, marketingEnabled: true, dailyLimit: 5000 },
    security: { adminSecretConfigured: false, sqlReadMode: 'off', cookieSecure: false },
    features: { dexcomLive: false, googleAuth: false, pushNotifications: false },
  },
};

export const ADMIN_FALLBACK_PERMISSIONS: AdminPermissionsPayload = {
  ok: true,
  roles: [
    { id: 'super_admin', label: 'Super Admin', description: 'Full access to all admin modules and permissions.' },
    { id: 'ops', label: 'Operations', description: 'Monitoring, households, technical settings.' },
    { id: 'marketing', label: 'Marketing', description: 'Assets, campaigns, templates, analytics.' },
    { id: 'support', label: 'Support', description: 'Tickets, member lookup, template replies.' },
    { id: 'finance', label: 'Finance', description: 'Revenue, refunds, subscriber metrics.' },
    { id: 'viewer', label: 'Viewer', description: 'Read-only overview access.' },
  ],
  admins: [
    { id: 'bootstrap', email: 'dnainform@gmail.com', name: 'Site Super Admin', role: 'super_admin', lastActive: new Date().toISOString(), scopes: ['all'] },
    { id: 'ops-1', email: 'ops@type1and2.com', name: 'Operations Lead', role: 'ops', lastActive: new Date().toISOString(), scopes: ['monitoring', 'settings'] },
  ],
};

export const ADMIN_FALLBACK_INVITATIONS: AdminInvitationsPayload = {
  ok: true,
  campaigns: [
    { id: 'inv-welcome', name: 'New member welcome', status: 'active', audience: 'Recent signups', sent: 128, scheduled: 0, templateId: 'welcome' },
    { id: 'inv-type1-circle', name: 'Type 1 family invite blast', status: 'scheduled', audience: 'Manual list', sent: 0, scheduled: 240, templateId: 'invite-type1' },
    { id: 'inv-type2-partner', name: 'Type 2 partner invite', status: 'draft', audience: 'Clinic partners', sent: 0, scheduled: 0, templateId: 'invite-type2' },
    { id: 'inv-newsletter', name: 'Monthly product update', status: 'active', audience: 'All members', sent: 890, scheduled: 0, templateId: 'marketing-newsletter' },
  ],
  templates: [],
};

export const ADMIN_FALLBACK_MARKETING: { ok: boolean; items: AdminMarketingAsset[] } = {
  ok: true,
  items: [
    { id: 'asset-deck-main', title: 'Type1 and 2 — Product Overview', kind: 'presentation', format: 'PDF / Slides', size: '4.2 MB', updatedAt: new Date().toISOString(), url: `${SITE}/`, description: 'Core product story for clinicians, families, and partners.' },
    { id: 'asset-video-intro', title: 'How families use Type1 and 2', kind: 'video', format: 'MP4', size: '28 MB', updatedAt: new Date().toISOString(), url: `${SITE}/`, description: '90-second walkthrough of daily view and support flow.' },
    { id: 'asset-onepager', title: 'One-page summary', kind: 'document', format: 'PDF', size: '820 KB', updatedAt: new Date().toISOString(), url: `${SITE}/`, description: 'Print-ready overview with logo, domain, and compliance note.' },
    { id: 'asset-brand-kit', title: 'Brand kit — logos & colors', kind: 'document', format: 'ZIP', size: '12 MB', updatedAt: new Date().toISOString(), url: '/brand/logo-mark.png', description: 'Mark, wordmark, teal/orange palette, typography guidance.' },
    { id: 'asset-type1-flyer', title: 'Type 1 family flyer', kind: 'document', format: 'PDF', size: '1.1 MB', updatedAt: new Date().toISOString(), url: `${SITE}/create-account?type=type1`, description: 'School and caregiver handout for Type 1 circles.' },
    { id: 'asset-type2-flyer', title: 'Type 2 adult flyer', kind: 'document', format: 'PDF', size: '1.0 MB', updatedAt: new Date().toISOString(), url: `${SITE}/create-account?type=type2`, description: 'Partner and clinic handout for Type 2 support.' },
  ],
};

export const ADMIN_FALLBACK_ANALYTICS: AdminAnalyticsPayload = {
  ok: true,
  visitors: { today: 312, week: 2180, month: 9200, year: 68000 },
  signups: { total: 5, today: 1, week: 3, month: 4, year: 5, byMonth: [], byType: { type1: 3, type2: 2, unknown: 0 }, superAdmins: 1 },
  conversionRate: 2.4,
  channels: [
    { channel: 'Organic search', visits: 1240, signups: 2, share: 38 },
    { channel: 'Direct', visits: 890, signups: 1, share: 27 },
    { channel: 'Email invite', visits: 420, signups: 1, share: 13 },
    { channel: 'Social', visits: 610, signups: 0, share: 19 },
  ],
  campaigns: [
    { id: 'camp-welcome', name: 'Welcome series', sent: 820, opened: 512, clicked: 184, converted: 42 },
    { id: 'camp-type1', name: 'Type 1 family invite', sent: 430, opened: 290, clicked: 96, converted: 28 },
  ],
  users: { total: 5, today: 1, week: 3, month: 4, year: 5, byMonth: [], byType: { type1: 3, type2: 2, unknown: 0 }, superAdmins: 1 },
};

export const ADMIN_FALLBACK_FINANCE: AdminFinancePayload = {
  ok: true,
  currency: 'USD',
  plans: [
    { id: 'member-monthly', name: 'Member Monthly', price: 12, interval: 'month' },
    { id: 'member-annual', name: 'Member Annual', price: 99, interval: 'year' },
    { id: 'family-plus', name: 'Family Plus', price: 19, interval: 'month' },
  ],
  revenue: { mrr: 12, arr: 144, today: 1, month: 12, year: 118, allTime: 159 },
  subscribers: { paid: 1, trial: 3, free: 1, churned: 0 },
  transactions: [
    { id: 'tx-001', type: 'purchase', amount: 12, user: 'member@example.com', reason: 'Monthly plan', at: new Date().toISOString() },
    { id: 'tx-002', type: 'purchase', amount: 99, user: 'family@example.com', reason: 'Annual plan', at: new Date(Date.now() - 86400000 * 3).toISOString() },
  ],
  refunds: { count: 0, amount: 0 },
  note: 'Finance metrics use model defaults until billing is connected.',
  users: { total: 5, today: 1, week: 3, month: 4, year: 5, byMonth: [], byType: { type1: 3, type2: 2, unknown: 0 }, superAdmins: 1 },
};

export const ADMIN_FALLBACK_MONITORING: AdminMonitoringPayload = {
  ok: true,
  summary: ADMIN_FALLBACK_SUMMARY,
  monitoring: {
    uptime: '99.97%',
    apiLatencyMs: 42,
    errorRate: 0.08,
    backgroundJobs: { dexcomSync: 'mock', healthPortalSync: 'scheduled', escalationPass: 'healthy', sqlMirror: 'off' },
    storage: 'kv',
    alerts: ['Connect DATABASE_URL and run npm run db:backfill'],
    env: { node: 'v22', siteUrl: SITE, dataDir: 'server/data' },
  },
};

export const ADMIN_FALLBACK_EMAIL_TEMPLATES: { ok: boolean; items: AdminEmailTemplate[] } = {
  ok: true,
  items: getEmailTemplates(),
};
