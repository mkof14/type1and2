import { applySecurityHeaders } from '../../security-headers.mjs';
import {
  buildHealthRecordsSummary,
  connectHealthPortal,
  createPkcePair,
  disconnectHealthPortal,
  getPortalCatalogEntry,
  healthPortalOAuthCallback,
  healthPortalOAuthStart,
  refreshHealthPortalToken,
  syncHealthPortal,
} from '../../services/health-portal-service.mjs';

export const handleHealthPortalRoutes = async (ctx) => {
  const {
    req,
    res,
    url,
    sendJson,
    readBody,
    BODY_TOO_LARGE,
    findSessionUser,
    readHouseholds,
    persistHouseholdUpdate,
    buildWorkspacePayloadForRequest,
    safeText,
    SITE_URL,
    createOAuthState,
    consumeOAuthState,
  } = ctx;

  if (!url.pathname.startsWith('/api/health-portal/')) {
    return false;
  }

  if (req.method === 'GET' && url.pathname === '/api/health-portal/oauth/callback') {
    const code = safeText(url.searchParams.get('code'), 240);
    const state = safeText(url.searchParams.get('state'), 120);
    const oauthState = state ? await consumeOAuthState(state) : null;
    const redirectBase = `${SITE_URL.replace(/\/$/, '')}/workspace`;
    const current = await findSessionUser(req);
    const portalId = oauthState?.portalId || 'epic_mychart';

    if (!code || !oauthState || !current || current.user.householdId !== oauthState.householdId) {
      applySecurityHeaders(res);
      res.writeHead(302, { Location: `${redirectBase}?health_portal_auth=error&portal=${encodeURIComponent(portalId)}` });
      res.end();
      return true;
    }

    if (oauthState.userId && oauthState.userId !== current.user.id) {
      applySecurityHeaders(res);
      res.writeHead(302, { Location: `${redirectBase}?health_portal_auth=error&portal=${encodeURIComponent(portalId)}` });
      res.end();
      return true;
    }

    const households = await readHouseholds();
    const householdIndex = households.findIndex((entry) => entry.id === oauthState.householdId);
    if (householdIndex === -1) {
      applySecurityHeaders(res);
      res.writeHead(302, { Location: `${redirectBase}?health_portal_auth=error` });
      res.end();
      return true;
    }

    try {
      const { portals } = await healthPortalOAuthCallback(
        households[householdIndex],
        portalId,
        code,
        oauthState.codeVerifier || '',
      );
      let nextHousehold = { ...households[householdIndex], healthPortals: portals, updatedAt: new Date().toISOString() };
      const synced = await syncHealthPortal(nextHousehold, portalId, 'oauth');
      nextHousehold = { ...nextHousehold, healthPortals: synced.portals, updatedAt: new Date().toISOString() };
      await persistHouseholdUpdate(households, householdIndex, nextHousehold);
      applySecurityHeaders(res);
      res.writeHead(302, { Location: `${redirectBase}?health_portal_auth=success&portal=${encodeURIComponent(portalId)}` });
      res.end();
    } catch {
      applySecurityHeaders(res);
      res.writeHead(302, { Location: `${redirectBase}?health_portal_auth=error&portal=${encodeURIComponent(portalId)}` });
      res.end();
    }
    return true;
  }

  const current = await findSessionUser(req);
  if (!current?.user?.householdId) {
    sendJson(res, 401, { error: 'Authentication required' });
    return true;
  }

  const households = await readHouseholds();
  const householdIndex = households.findIndex((entry) => entry.id === current.user.householdId);
  if (householdIndex === -1) {
    sendJson(res, 404, { error: 'Household not found' });
    return true;
  }

  const household = households[householdIndex];

  if (req.method === 'GET' && url.pathname === '/api/health-portal/summary') {
    sendJson(res, 200, {
      ok: true,
      summary: buildHealthRecordsSummary(household),
      workspace: buildWorkspacePayloadForRequest(req, current.user, household),
    });
    return true;
  }

  if (req.method === 'POST' && url.pathname === '/api/health-portal/oauth/start') {
    const body = await readBody(req);
    if (body === BODY_TOO_LARGE) {
      sendJson(res, 413, { error: 'Payload too large' });
      return true;
    }
    const portalId = safeText(body?.portalId, 80) || 'epic_mychart';
    const catalog = getPortalCatalogEntry(portalId);
    if (!catalog || catalog.authMode !== 'oauth_smart') {
      sendJson(res, 400, { error: 'Portal does not support OAuth' });
      return true;
    }

    try {
      const { codeVerifier } = createPkcePair();
      const stateToken = await createOAuthState(household.id, current.user.id, {
        kind: 'health_portal',
        portalId,
        codeVerifier,
      });
      const start = healthPortalOAuthStart(household, portalId, stateToken, codeVerifier);
      const nextHousehold = { ...household, healthPortals: start.portals, updatedAt: new Date().toISOString() };
      await persistHouseholdUpdate(households, householdIndex, nextHousehold);

      if (!start.redirectUrl) {
        sendJson(res, 400, { error: nextHousehold.healthPortals[portalId]?.message || 'OAuth not configured' });
        return true;
      }

      sendJson(res, 200, {
        ok: true,
        redirectUrl: start.redirectUrl,
        workspace: buildWorkspacePayloadForRequest(req, current.user, nextHousehold),
      });
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : 'OAuth start failed' });
    }
    return true;
  }

  if (req.method === 'POST' && url.pathname === '/api/health-portal/refresh-token') {
    const body = await readBody(req);
    const portalId = safeText(body?.portalId, 80);
    try {
      const { portals } = await refreshHealthPortalToken(household, portalId);
      const nextHousehold = { ...household, healthPortals: portals, updatedAt: new Date().toISOString() };
      await persistHouseholdUpdate(households, householdIndex, nextHousehold);
      sendJson(res, 200, { ok: true, workspace: buildWorkspacePayloadForRequest(req, current.user, nextHousehold) });
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : 'Refresh failed' });
    }
    return true;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return true;
  }

  const body = await readBody(req);
  if (body === BODY_TOO_LARGE) {
    sendJson(res, 413, { error: 'Payload too large' });
    return true;
  }
  if (!body || typeof body !== 'object') {
    sendJson(res, 400, { error: 'Invalid JSON body' });
    return true;
  }

  const portalId = safeText(body.portalId, 80);

  if (url.pathname === '/api/health-portal/connect') {
    try {
      const catalog = getPortalCatalogEntry(portalId);
      if (catalog?.authMode === 'oauth_smart') {
        sendJson(res, 400, { error: 'Use /api/health-portal/oauth/start for this portal' });
        return true;
      }
      const { portals } = connectHealthPortal(household, portalId);
      let nextHousehold = { ...household, healthPortals: portals, updatedAt: new Date().toISOString() };
      const synced = await syncHealthPortal(nextHousehold, portalId, 'manual');
      nextHousehold = { ...nextHousehold, healthPortals: synced.portals, updatedAt: new Date().toISOString() };
      await persistHouseholdUpdate(households, householdIndex, nextHousehold);
      sendJson(res, 200, {
        ok: true,
        summary: buildHealthRecordsSummary(nextHousehold),
        workspace: buildWorkspacePayloadForRequest(req, current.user, nextHousehold),
      });
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : 'Connect failed' });
    }
    return true;
  }

  if (url.pathname === '/api/health-portal/sync') {
    try {
      const synced = await syncHealthPortal(household, portalId, 'manual');
      const nextHousehold = { ...household, healthPortals: synced.portals, updatedAt: new Date().toISOString() };
      await persistHouseholdUpdate(households, householdIndex, nextHousehold);
      sendJson(res, 200, {
        ok: true,
        summary: buildHealthRecordsSummary(nextHousehold),
        workspace: buildWorkspacePayloadForRequest(req, current.user, nextHousehold),
      });
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : 'Sync failed' });
    }
    return true;
  }

  if (url.pathname === '/api/health-portal/disconnect') {
    try {
      const { portals } = disconnectHealthPortal(household, portalId);
      const nextHousehold = { ...household, healthPortals: portals, updatedAt: new Date().toISOString() };
      await persistHouseholdUpdate(households, householdIndex, nextHousehold);
      sendJson(res, 200, {
        ok: true,
        summary: buildHealthRecordsSummary(nextHousehold),
        workspace: buildWorkspacePayloadForRequest(req, current.user, nextHousehold),
      });
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : 'Disconnect failed' });
    }
    return true;
  }

  sendJson(res, 404, { error: 'Not found' });
  return true;
};
