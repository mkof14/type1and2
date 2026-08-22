import {
  computeFinanceMetrics,
  computeMarketingAnalytics,
  computeUserMetrics,
  getAdminPermissions,
  getAdminSettings,
  getEmailTemplates,
  getInvitationCampaigns,
  getMarketingAssets,
  getMonitoringSnapshot,
  getSupportTickets,
} from '../../services/admin-console-data.mjs';
import { isSuperAdminUser, decorateSuperAdminUser } from '../../lib/super-admin.mjs';
import { getStorageBackend, probeStorage } from '../../storage.mjs';
import { dexcomEnvConfig } from '../../dexcom-service.mjs';
import { isUpstashRateLimitEnabled } from '../../rate-limit.mjs';
import { ALERT_RULE_VERSION } from '../../domain/alerts/alert-rules.mjs';
import { getSqlReadMode } from '../../infrastructure/repositories/sql-read-service.mjs';
import { getPool } from '../../infrastructure/db.mjs';
import { listDeliveriesForHousehold } from '../../services/notification-service.mjs';

const authorizeAdmin = async (req, res, sendJson, safeEqualString, CRON_SECRET, findSessionUser) => {
  const adminSecret = String(process.env.T1D_ADMIN_SECRET || CRON_SECRET || '').trim();
  const authHeader = String(req.headers.authorization || '');

  if (adminSecret && safeEqualString(authHeader, `Bearer ${adminSecret}`)) {
    return true;
  }

  if (typeof findSessionUser === 'function') {
    const current = await findSessionUser(req);
    const user = decorateSuperAdminUser(current?.user);
    if (user && isSuperAdminUser(user)) {
      return true;
    }
  }

  if (!adminSecret) {
    sendJson(res, 503, { error: 'Admin access is not configured. Sign in as super admin or set T1D_ADMIN_SECRET.' });
    return false;
  }

  sendJson(res, 401, { error: 'Unauthorized admin request' });
  return false;
};

const countKvHouseholds = async (readJson, DATA_DIR) => {
  const householdsPayload = await readJson(`${DATA_DIR}/households.json`, { households: [] });
  const usersPayload = await readJson(`${DATA_DIR}/users.json`, { users: [] });
  const households = Array.isArray(householdsPayload.households) ? householdsPayload.households : [];
  const users = Array.isArray(usersPayload.users) ? usersPayload.users : [];
  const activeAlerts = households.filter((household) =>
    ['parent_alerted', 'parent_handling', 'caregiver_escalated', 'caregiver_active'].includes(household?.safetyState?.stage)
  ).length;

  return {
    households: households.length,
    users: users.length,
    activeAlerts,
    inMemoryNotifications: households.reduce(
      (total, household) => total + listDeliveriesForHousehold(household.id).length,
      0,
    ),
    usersList: users,
  };
};

const countSqlSummary = async () => {
  const pool = await getPool();
  if (!pool) return null;

  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM households) AS households,
        (SELECT COUNT(*)::int FROM users) AS users,
        (SELECT COUNT(*)::int FROM alerts WHERE status = 'active') AS active_alerts,
        (SELECT COUNT(*)::int FROM notification_deliveries) AS notification_deliveries,
        (SELECT COUNT(*)::int FROM escalations) AS escalations,
        (SELECT COUNT(*)::int FROM glucose_readings) AS glucose_readings,
        (SELECT COUNT(*)::int FROM audit_events) AS audit_events
    `);
    return result.rows[0] || null;
  } finally {
    await pool.end();
  }
};

const buildSummaryPayload = async (readJson, DATA_DIR) => {
  const storageProbe = await probeStorage();
  const kvCounts = await countKvHouseholds(readJson, DATA_DIR);
  const sqlCounts = await countSqlSummary();
  const { usersList, ...kv } = kvCounts;

  return {
    ok: true,
    service: 't1d-api',
    timestamp: new Date().toISOString(),
    storage: storageProbe.backend || getStorageBackend(),
    sqlRead: getSqlReadMode(),
    rateLimit: isUpstashRateLimitEnabled() ? 'upstash' : 'memory',
    dexcomLive: dexcomEnvConfig().useLiveMode,
    alertRuleVersion: ALERT_RULE_VERSION,
    kv,
    sql: sqlCounts,
    recommendations: [
      sqlCounts ? null : 'Set DATABASE_URL and run npm run db:backfill',
      getSqlReadMode() === 'off' ? 'Enable T1D_SQL_READ_SHADOW=true on production after parity' : null,
      getSqlReadMode() === 'shadow' ? 'Watch logs; then set T1D_SQL_READ=true' : null,
      dexcomEnvConfig().useLiveMode ? null : 'Add Dexcom credentials for live CGM',
    ].filter(Boolean),
    usersList,
  };
};

export const handleAdminRoutes = async (ctx) => {
  const {
    req,
    res,
    url,
    sendJson,
    safeEqualString,
    CRON_SECRET,
    readJson,
    DATA_DIR,
    findSessionUser,
  } = ctx;

  if (!url.pathname.startsWith('/api/admin/')) {
    return false;
  }

  if (!(await authorizeAdmin(req, res, sendJson, safeEqualString, CRON_SECRET, findSessionUser))) {
    return true;
  }

  const readUsersList = async () => {
    const payload = await readJson(`${DATA_DIR}/users.json`, { users: [] });
    return Array.isArray(payload.users) ? payload.users : [];
  };

  if (req.method === 'GET' && url.pathname === '/api/admin/summary') {
    const summary = await buildSummaryPayload(readJson, DATA_DIR);
    const { usersList, ...publicSummary } = summary;
    sendJson(res, 200, publicSummary);
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/households') {
    const householdsPayload = await readJson(`${DATA_DIR}/households.json`, { households: [] });
    const households = Array.isArray(householdsPayload.households) ? householdsPayload.households : [];
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') || 20)));

    sendJson(res, 200, {
      ok: true,
      total: households.length,
      items: households.slice(0, limit).map((household) => ({
        id: household.id,
        householdName: household.householdName,
        diabetesType: household.diabetesType,
        stage: household.safetyState?.stage || 'monitoring',
        responderState: household.safetyState?.responderOwnership?.state || 'no_responder',
        alertsCount: household.safetyState?.alertsCount || 0,
        dexcomStatus: household.dexcom?.status || 'disconnected',
        updatedAt: household.updatedAt,
      })),
    });
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/analytics') {
    const users = await readUsersList();
    sendJson(res, 200, { ok: true, ...computeMarketingAnalytics(users), users: computeUserMetrics(users) });
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/finance') {
    const users = await readUsersList();
    sendJson(res, 200, { ok: true, ...computeFinanceMetrics(users), users: computeUserMetrics(users) });
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/marketing/assets') {
    sendJson(res, 200, { ok: true, items: getMarketingAssets() });
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/email-templates') {
    sendJson(res, 200, { ok: true, items: getEmailTemplates() });
    return true;
  }

  if (req.method === 'GET' && url.pathname.startsWith('/api/admin/email-templates/')) {
    const id = url.pathname.split('/').pop();
    const template = getEmailTemplates().find((entry) => entry.id === id);
    if (!template) {
      sendJson(res, 404, { error: 'Template not found' });
      return true;
    }
    sendJson(res, 200, { ok: true, template });
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/permissions') {
    const users = await readUsersList();
    sendJson(res, 200, { ok: true, ...getAdminPermissions(users) });
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/settings') {
    sendJson(res, 200, { ok: true, settings: getAdminSettings() });
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/support') {
    sendJson(res, 200, { ok: true, tickets: getSupportTickets() });
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/invitations') {
    sendJson(res, 200, { ok: true, campaigns: getInvitationCampaigns(), templates: getEmailTemplates().filter((t) => t.category === 'Invitation' || t.category === 'Marketing' || t.category === 'Onboarding') });
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/monitoring') {
    const summary = await buildSummaryPayload(readJson, DATA_DIR);
    sendJson(res, 200, { ok: true, summary, monitoring: getMonitoringSnapshot(summary) });
    return true;
  }

  sendJson(res, 404, { error: 'Not found' });
  return true;
};
