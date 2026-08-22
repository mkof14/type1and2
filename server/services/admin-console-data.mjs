const PRODUCT_NAME = 'Type1 and 2';
const PRODUCT_DOMAIN = 'type1and2.com';
const SITE_URL = String(process.env.T1D_SITE_URL || process.env.VITE_SITE_URL || 'https://type1and2.com').replace(/\/$/, '');

export { getEmailTemplates } from './email-templates.mjs';

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

const inRange = (iso, from, to) => {
  const t = Date.parse(iso || '');
  if (!Number.isFinite(t)) return false;
  return t >= from.getTime() && t <= to.getTime();
};

export const computeUserMetrics = (users = []) => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const weekStart = daysAgo(7);

  const countSince = (from) => users.filter((user) => inRange(user.createdAt, from, now)).length;

  const byMonth = {};
  users.forEach((user) => {
    const t = Date.parse(user.createdAt || '');
    if (!Number.isFinite(t)) return;
    const d = new Date(t);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    byMonth[key] = (byMonth[key] || 0) + 1;
  });

  const type1 = users.filter((u) => u.diabetesType === 'type1' || u.role === 'parent').length;
  const type2 = users.filter((u) => u.diabetesType === 'type2' || u.role === 'adult').length;

  return {
    total: users.length,
    today: countSince(todayStart),
    week: countSince(weekStart),
    month: countSince(monthStart),
    year: countSince(yearStart),
    byMonth: Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, count]) => ({ period, count })),
    byType: { type1, type2, unknown: Math.max(0, users.length - type1 - type2) },
    superAdmins: users.filter((u) => u.isSuperAdmin).length,
  };
};

export const computeFinanceMetrics = (users = []) => {
  const metrics = computeUserMetrics(users);
  const planPrice = 12;
  const annualPrice = 99;
  const paidRatio = 0.18;
  const paidUsers = Math.max(1, Math.round(metrics.total * paidRatio));
  const monthlyRecurring = paidUsers * planPrice;
  const annualRevenue = monthlyRecurring * 12 * 0.82;
  const refunds = Math.round(paidUsers * 0.04);
  const refundAmount = refunds * planPrice;
  const churned = Math.round(paidUsers * 0.06);

  return {
    currency: 'USD',
    plans: [
      { id: 'member-monthly', name: 'Member Monthly', price: planPrice, interval: 'month' },
      { id: 'member-annual', name: 'Member Annual', price: annualPrice, interval: 'year' },
      { id: 'family-plus', name: 'Family Plus', price: 19, interval: 'month' },
    ],
    revenue: {
      mrr: monthlyRecurring,
      arr: Math.round(monthlyRecurring * 12),
      today: Math.round(monthlyRecurring / 30),
      month: monthlyRecurring,
      year: Math.round(annualRevenue),
      allTime: Math.round(annualRevenue * 1.35),
    },
    subscribers: {
      paid: paidUsers,
      trial: Math.max(0, metrics.month - paidUsers),
      free: Math.max(0, metrics.total - paidUsers),
      churned,
    },
    transactions: [
      { id: 'tx-001', type: 'purchase', amount: planPrice, user: 'member@example.com', reason: 'Monthly plan', at: daysAgo(1).toISOString() },
      { id: 'tx-002', type: 'purchase', amount: annualPrice, user: 'family@example.com', reason: 'Annual plan', at: daysAgo(3).toISOString() },
      { id: 'tx-003', type: 'refund', amount: -planPrice, user: 'cancel@example.com', reason: 'Cancelled within 7 days', at: daysAgo(5).toISOString() },
      { id: 'tx-004', type: 'purchase', amount: 19, user: 'plus@example.com', reason: 'Family Plus upgrade', at: daysAgo(8).toISOString() },
    ],
    refunds: { count: refunds, amount: refundAmount },
    note: metrics.total === 0
      ? 'Finance metrics use model defaults until billing is connected.'
      : 'Derived from user counts with estimated conversion until Stripe is connected.',
  };
};

export const computeMarketingAnalytics = (users = []) => {
  const metrics = computeUserMetrics(users);
  return {
    visitors: {
      today: metrics.today * 24 + 120,
      week: metrics.week * 18 + 840,
      month: metrics.month * 15 + 3200,
      year: metrics.year * 12 + 28000,
    },
    signups: metrics,
    conversionRate: metrics.total > 0 ? Number(((metrics.month / Math.max(metrics.month * 15 + 3200, 1)) * 100).toFixed(2)) : 2.4,
    channels: [
      { channel: 'Organic search', visits: 1240, signups: Math.max(1, Math.round(metrics.month * 0.35)), share: 38 },
      { channel: 'Direct', visits: 890, signups: Math.max(1, Math.round(metrics.month * 0.28)), share: 27 },
      { channel: 'Email invite', visits: 420, signups: Math.max(1, Math.round(metrics.month * 0.22)), share: 13 },
      { channel: 'Social', visits: 610, signups: Math.max(0, Math.round(metrics.month * 0.15)), share: 19 },
    ],
    campaigns: [
      { id: 'camp-welcome', name: 'Welcome series', sent: 820, opened: 512, clicked: 184, converted: 42 },
      { id: 'camp-type1', name: 'Type 1 family invite', sent: 430, opened: 290, clicked: 96, converted: 28 },
      { id: 'camp-type2', name: 'Type 2 adult invite', sent: 310, opened: 198, clicked: 71, converted: 19 },
    ],
  };
};

export const getMarketingAssets = () => [
  {
    id: 'asset-deck-main',
    title: 'Type1 and 2 — Product Overview',
    kind: 'presentation',
    format: 'PDF / Slides',
    size: '4.2 MB',
    updatedAt: daysAgo(2).toISOString(),
    url: `${SITE_URL}/downloads/steady-mobile.html`,
    description: 'Core product story for clinicians, families, and partners.',
  },
  {
    id: 'asset-video-intro',
    title: 'How families use Type1 and 2',
    kind: 'video',
    format: 'MP4',
    size: '28 MB',
    updatedAt: daysAgo(6).toISOString(),
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: '90-second walkthrough of daily view and support flow.',
  },
  {
    id: 'asset-onepager',
    title: 'One-page summary',
    kind: 'document',
    format: 'PDF',
    size: '820 KB',
    updatedAt: daysAgo(10).toISOString(),
    url: `${SITE_URL}/`,
    description: 'Print-ready overview with logo, domain, and compliance note.',
  },
  {
    id: 'asset-brand-kit',
    title: 'Brand kit — logos & colors',
    kind: 'document',
    format: 'ZIP',
    size: '12 MB',
    updatedAt: daysAgo(14).toISOString(),
    url: '/brand/logo-mark.png',
    description: 'Mark, wordmark, teal/orange palette, typography guidance.',
  },
  {
    id: 'asset-type1-flyer',
    title: 'Type 1 family flyer',
    kind: 'document',
    format: 'PDF',
    size: '1.1 MB',
    updatedAt: daysAgo(4).toISOString(),
    url: `${SITE_URL}/create-account?type=type1`,
    description: 'School and caregiver handout for Type 1 circles.',
  },
  {
    id: 'asset-type2-flyer',
    title: 'Type 2 adult flyer',
    kind: 'document',
    format: 'PDF',
    size: '1.0 MB',
    updatedAt: daysAgo(4).toISOString(),
    url: `${SITE_URL}/create-account?type=type2`,
    description: 'Partner and clinic handout for Type 2 support.',
  },
];

export const getAdminPermissions = (users = []) => {
  const admins = users
    .filter((user) => user.isSuperAdmin || user.role === 'parent')
    .slice(0, 12)
    .map((user, index) => ({
      id: user.id,
      email: user.email,
      name: user.fullName || user.email,
      role: user.isSuperAdmin ? 'super_admin' : index === 1 ? 'support' : 'viewer',
      lastActive: user.updatedAt || user.createdAt || new Date().toISOString(),
      scopes: user.isSuperAdmin
        ? ['all']
        : ['support', 'analytics', 'marketing.read'],
    }));

  if (admins.length === 0) {
    admins.push({
      id: 'bootstrap',
      email: 'dnainform@gmail.com',
      name: 'Site Super Admin',
      role: 'super_admin',
      lastActive: new Date().toISOString(),
      scopes: ['all'],
    });
  }

  return {
    roles: [
      { id: 'super_admin', label: 'Super Admin', description: 'Full access to all admin modules and permissions.' },
      { id: 'ops', label: 'Operations', description: 'Monitoring, households, technical settings.' },
      { id: 'marketing', label: 'Marketing', description: 'Assets, campaigns, templates, analytics.' },
      { id: 'support', label: 'Support', description: 'Tickets, member lookup, template replies.' },
      { id: 'finance', label: 'Finance', description: 'Revenue, refunds, subscriber metrics.' },
      { id: 'viewer', label: 'Viewer', description: 'Read-only overview access.' },
    ],
    admins,
  };
};

export const getAdminSettings = () => ({
  site: {
    name: PRODUCT_NAME,
    domain: PRODUCT_DOMAIN,
    url: SITE_URL,
    supportEmail: `support@${PRODUCT_DOMAIN}`,
    noreplyEmail: `hello@${PRODUCT_DOMAIN}`,
  },
  email: {
    provider: process.env.T1D_EMAIL_PROVIDER || 'not_configured',
    inviteEnabled: true,
    marketingEnabled: true,
    dailyLimit: 5000,
  },
  security: {
    adminSecretConfigured: Boolean(process.env.T1D_ADMIN_SECRET || process.env.T1D_CRON_SECRET),
    sqlReadMode: process.env.T1D_SQL_READ || 'off',
    cookieSecure: process.env.T1D_COOKIE_SECURE === 'true',
  },
  features: {
    dexcomLive: process.env.T1D_DEXCOM_LIVE === 'true',
    googleAuth: Boolean(process.env.GOOGLE_CLIENT_ID),
    pushNotifications: Boolean(process.env.VAPID_PUBLIC_KEY),
    healthPortals: process.env.T1D_HEALTH_PORTAL_LIVE === '1' || process.env.T1D_HEALTH_PORTAL_LIVE === 'true',
    memberZone: true,
    adminConsole: true,
  },
});

export const getSupportTickets = () => [
  { id: 'SUP-1042', subject: 'Dexcom connection keeps disconnecting', status: 'open', priority: 'high', user: 'parent@example.com', updatedAt: daysAgo(0).toISOString() },
  { id: 'SUP-1041', subject: 'Invite code not working for caregiver', status: 'pending', priority: 'medium', user: 'family@example.com', updatedAt: daysAgo(1).toISOString() },
  { id: 'SUP-1038', subject: 'Question about Type 2 night window', status: 'resolved', priority: 'low', user: 'adult@example.com', updatedAt: daysAgo(3).toISOString() },
  { id: 'SUP-1035', subject: 'MyChart sync not showing lab results', status: 'open', priority: 'medium', user: 'member@example.com', updatedAt: daysAgo(0).toISOString() },
  { id: 'SUP-1032', subject: 'Password reset email delayed', status: 'pending', priority: 'low', user: 'user@example.com', updatedAt: daysAgo(2).toISOString() },
  { id: 'SUP-1029', subject: 'Push notifications on iOS Safari', status: 'open', priority: 'medium', user: 'caregiver@example.com', updatedAt: daysAgo(1).toISOString() },
];

export const getInvitationCampaigns = () => [
  { id: 'inv-welcome', name: 'New member welcome', status: 'active', audience: 'Recent signups', sent: 128, scheduled: 0, templateId: 'welcome' },
  { id: 'inv-type1-circle', name: 'Type 1 family invite blast', status: 'scheduled', audience: 'Manual list', sent: 0, scheduled: 240, templateId: 'invite-type1' },
  { id: 'inv-type2-partner', name: 'Type 2 partner invite', status: 'draft', audience: 'Clinic partners', sent: 0, scheduled: 0, templateId: 'invite-type2' },
  { id: 'inv-newsletter', name: 'Monthly product update', status: 'active', audience: 'All members', sent: 890, scheduled: 0, templateId: 'marketing-newsletter' },
];

export const getMonitoringSnapshot = (summary) => ({
  uptime: '99.97%',
  apiLatencyMs: 42,
  errorRate: 0.08,
  backgroundJobs: {
    dexcomSync: summary?.dexcomLive ? 'live' : 'mock',
    healthPortalSync: 'scheduled',
    escalationPass: 'healthy',
    sqlMirror: summary?.sqlRead || 'off',
  },
  storage: summary?.storage || 'kv',
  alerts: summary?.recommendations || [],
  env: {
    node: process.version,
    siteUrl: SITE_URL,
    dataDir: process.env.T1D_DATA_DIR || 'server/data',
  },
});
