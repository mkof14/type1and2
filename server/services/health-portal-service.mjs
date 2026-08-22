import { createHash, randomBytes } from 'node:crypto';
import { decryptSecret, encryptSecret } from '../secrets-crypto.mjs';

const EPIC_SCOPES = 'launch/patient patient/*.read openid fhirUser offline_access';
const SYNC_INTERVAL_SEC = Number(process.env.T1D_HEALTH_PORTAL_SYNC_INTERVAL_SEC || 3600);

const PORTAL_CATALOG = {
  epic_mychart: {
    id: 'epic_mychart',
    name: 'Epic MyChart',
    vendor: 'Epic Systems',
    authMode: 'oauth_smart',
    fhirVersion: 'R4',
    accent: 'teal',
    recordTypes: ['labs', 'medications', 'visits', 'allergies', 'conditions', 'immunizations'],
    oauthProvider: 'epic',
  },
  cerner: {
    id: 'cerner',
    name: 'Cerner / Oracle Health',
    vendor: 'Oracle Health',
    authMode: 'oauth_smart',
    fhirVersion: 'R4',
    accent: 'blue',
    recordTypes: ['labs', 'medications', 'visits', 'vitals', 'procedures'],
    oauthProvider: 'cerner',
  },
  commonwell: {
    id: 'commonwell',
    name: 'CommonWell Health Alliance',
    vendor: 'CommonWell',
    authMode: 'oauth_broker',
    fhirVersion: 'R4',
    accent: 'indigo',
    recordTypes: ['visits', 'labs', 'medications', 'care_team'],
    oauthProvider: '',
  },
  apple_health: {
    id: 'apple_health',
    name: 'Apple Health',
    vendor: 'Apple',
    authMode: 'device_export',
    fhirVersion: 'export',
    accent: 'rose',
    recordTypes: ['vitals', 'activity', 'labs', 'medications'],
    oauthProvider: '',
  },
  google_health: {
    id: 'google_health',
    name: 'Google Health Connect',
    vendor: 'Google',
    authMode: 'device_export',
    fhirVersion: 'export',
    accent: 'green',
    recordTypes: ['vitals', 'activity', 'nutrition', 'sleep'],
    oauthProvider: '',
  },
};

const nowIso = () => new Date().toISOString();
const nextSyncAt = (seconds = SYNC_INTERVAL_SEC) => new Date(Date.now() + seconds * 1000).toISOString();

export const healthPortalEnvConfig = (provider = 'epic') => {
  const siteUrl = String(process.env.T1D_SITE_URL || process.env.SITE_URL || 'http://localhost:3002').replace(/\/$/, '');
  const redirectUri = String(
    process.env.T1D_EPIC_REDIRECT_URI || `${siteUrl}/api/health-portal/oauth/callback`,
  ).trim();
  const clientId = String(process.env.T1D_EPIC_CLIENT_ID || '').trim();
  const clientSecret = String(process.env.T1D_EPIC_CLIENT_SECRET || '').trim();
  const authorizeBase = String(process.env.T1D_EPIC_AUTHORIZE_URL || 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize').trim();
  const tokenBase = String(process.env.T1D_EPIC_TOKEN_URL || 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token').trim();
  const fhirBase = String(process.env.T1D_EPIC_FHIR_BASE || 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4').replace(/\/$/, '');
  const useLiveMode = process.env.T1D_HEALTH_PORTAL_LIVE === '1' || process.env.T1D_HEALTH_PORTAL_LIVE === 'true';
  const missingConfig = [];
  if (!clientId) missingConfig.push('T1D_EPIC_CLIENT_ID');
  const ready = Boolean(clientId) || !useLiveMode;
  return {
    provider,
    ready,
    useLiveMode: useLiveMode && Boolean(clientId),
    clientId,
    clientSecret,
    authorizeBase,
    tokenBase,
    fhirBase,
    redirectUri,
    missingConfig,
    syncIntervalSeconds: SYNC_INTERVAL_SEC,
  };
};

const defaultPortalState = (portalId) => ({
  portalId,
  status: 'disconnected',
  authMode: PORTAL_CATALOG[portalId]?.authMode || 'mock',
  configStatus: 'unknown',
  connectedAt: null,
  lastSyncAt: null,
  nextSyncDueAt: null,
  recordCount: 0,
  syncStatus: 'idle',
  message: '',
  records: [],
  accessTokenSealed: '',
  refreshTokenSealed: '',
  tokenExpiresAt: '',
  fhirBaseUrl: '',
  patientId: '',
  authorizePath: '',
  oauthRedirectPath: '/api/health-portal/oauth/callback',
  autoSyncState: 'idle',
});

export const ensureHealthPortals = (household) => {
  const existing = household?.healthPortals && typeof household.healthPortals === 'object'
    ? household.healthPortals
    : {};
  const portals = {};
  Object.keys(PORTAL_CATALOG).forEach((id) => {
    portals[id] = { ...defaultPortalState(id), ...(existing[id] || {}) };
  });
  return portals;
};

const sealPortalTokens = (portal) => {
  if (!portal) return portal;
  const next = { ...portal };
  if (portal.accessToken && !portal.accessTokenSealed) {
    next.accessTokenSealed = encryptSecret(portal.accessToken);
    delete next.accessToken;
  }
  if (portal.refreshToken && !portal.refreshTokenSealed) {
    next.refreshTokenSealed = encryptSecret(portal.refreshToken);
    delete next.refreshToken;
  }
  return next;
};

export const unsealPortalConnection = (portal) => {
  if (!portal) return defaultPortalState('epic_mychart');
  return {
    ...portal,
    accessToken: portal.accessToken || decryptSecret(portal.accessTokenSealed),
    refreshToken: portal.refreshToken || decryptSecret(portal.refreshTokenSealed),
  };
};

export const createPkcePair = () => {
  const codeVerifier = randomBytes(32).toString('base64url');
  const codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url');
  return { codeVerifier, codeChallenge };
};

const mockRecordsForPortal = (portalId, patientName = 'Member') => {
  const now = Date.now();
  const day = 86400000;
  const catalog = PORTAL_CATALOG[portalId];
  const base = [
    { id: `${portalId}-lab-a1c`, type: 'labs', title: 'A1c', value: '6.8%', unit: '', date: new Date(now - day * 12).toISOString(), source: catalog?.name || portalId, status: 'final' },
    { id: `${portalId}-med-met`, type: 'medications', title: 'Metformin 500mg', value: 'Twice daily', unit: '', date: new Date(now - day * 30).toISOString(), source: catalog?.name || portalId, status: 'active' },
    { id: `${portalId}-visit-endo`, type: 'visits', title: 'Endocrinology follow-up', value: 'Telehealth', unit: '', date: new Date(now - day * 45).toISOString(), source: catalog?.name || portalId, status: 'completed' },
    { id: `${portalId}-cond-t1d`, type: 'conditions', title: 'Type 1 diabetes', value: 'Active', unit: '', date: new Date(now - day * 400).toISOString(), source: catalog?.name || portalId, status: 'active' },
    { id: `${portalId}-vital-bg`, type: 'vitals', title: 'Blood glucose average', value: '142', unit: 'mg/dL', date: new Date(now - day * 2).toISOString(), source: catalog?.name || portalId, status: 'recent' },
    { id: `${portalId}-allergy`, type: 'allergies', title: 'Penicillin', value: 'Rash', unit: '', date: new Date(now - day * 800).toISOString(), source: catalog?.name || portalId, status: 'confirmed' },
  ];
  if (portalId === 'apple_health' || portalId === 'google_health') {
    base.push({ id: `${portalId}-steps`, type: 'activity', title: 'Daily steps', value: '8,420', unit: 'steps', date: new Date(now - day).toISOString(), source: catalog?.name, status: 'recent' });
  }
  return base.map((entry) => ({ ...entry, patientName }));
};

const fhirRequest = async (url, accessToken, timeoutMs = 12000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/fhir+json',
      },
      signal: controller.signal,
    });
    const raw = await response.text();
    let parsed = null;
    try { parsed = raw ? JSON.parse(raw) : null; } catch { parsed = null; }
    if (!response.ok) {
      throw new Error(`FHIR request failed (${response.status}): ${typeof parsed === 'object' ? parsed?.issue?.[0]?.diagnostics || response.statusText : raw}`);
    }
    return parsed;
  } finally {
    clearTimeout(timer);
  }
};

const mapFhirBundleToRecords = (resourceType, bundle, sourceName) => {
  const entries = Array.isArray(bundle?.entry) ? bundle.entry : [];
  return entries.map((entry, index) => {
    const resource = entry.resource || {};
    const id = resource.id || `${resourceType}-${index}`;
    const date = resource.effectiveDateTime || resource.recordedDate || resource.onsetDateTime || resource.period?.start || resource.meta?.lastUpdated || nowIso();
    if (resourceType === 'Observation') {
      const value = resource.valueQuantity
        ? `${resource.valueQuantity.value}${resource.valueQuantity.unit ? ` ${resource.valueQuantity.unit}` : ''}`
        : resource.valueString || resource.code?.text || 'Result';
      return { id: `obs-${id}`, type: 'labs', title: resource.code?.text || 'Lab result', value, unit: '', date, source: sourceName, status: resource.status || 'final' };
    }
    if (resourceType === 'MedicationRequest') {
      return { id: `med-${id}`, type: 'medications', title: resource.medicationCodeableConcept?.text || 'Medication', value: resource.dosageInstruction?.[0]?.text || 'Active', unit: '', date, source: sourceName, status: resource.status || 'active' };
    }
    if (resourceType === 'Condition') {
      return { id: `cond-${id}`, type: 'conditions', title: resource.code?.text || 'Condition', value: resource.clinicalStatus?.coding?.[0]?.code || 'active', unit: '', date, source: sourceName, status: 'active' };
    }
    if (resourceType === 'AllergyIntolerance') {
      return { id: `allergy-${id}`, type: 'allergies', title: resource.code?.text || 'Allergy', value: resource.reaction?.[0]?.manifestation?.[0]?.text || 'Confirmed', unit: '', date, source: sourceName, status: 'confirmed' };
    }
    if (resourceType === 'Encounter') {
      return { id: `enc-${id}`, type: 'visits', title: resource.type?.[0]?.text || 'Clinical visit', value: resource.class?.display || resource.status || 'completed', unit: '', date, source: sourceName, status: resource.status || 'completed' };
    }
    return null;
  }).filter(Boolean);
};

const fetchFhirRecordsLive = async (portal, env) => {
  const unsealed = unsealPortalConnection(portal);
  const accessToken = unsealed.accessToken;
  if (!accessToken) throw new Error('Missing access token for FHIR sync');

  const fhirBase = portal.fhirBaseUrl || env.fhirBase;
  const patientId = portal.patientId || 'me';
  const sourceName = PORTAL_CATALOG[portal.portalId]?.name || portal.portalId;
  const patientRef = patientId === 'me' ? 'Patient/me' : `Patient/${patientId}`;

  const resourceQueries = [
    ['Observation', `${fhirBase}/Observation?patient=${encodeURIComponent(patientRef)}&_count=20&_sort=-date`],
    ['MedicationRequest', `${fhirBase}/MedicationRequest?patient=${encodeURIComponent(patientRef)}&_count=15`],
    ['Condition', `${fhirBase}/Condition?patient=${encodeURIComponent(patientRef)}&_count=10`],
    ['AllergyIntolerance', `${fhirBase}/AllergyIntolerance?patient=${encodeURIComponent(patientRef)}&_count=10`],
    ['Encounter', `${fhirBase}/Encounter?patient=${encodeURIComponent(patientRef)}&_count=10&_sort=-date`],
  ];

  const records = [];
  for (const [type, url] of resourceQueries) {
    try {
      const bundle = await fhirRequest(url, accessToken);
      records.push(...mapFhirBundleToRecords(type, bundle, sourceName));
    } catch (error) {
      console.warn(`[health-portal] FHIR ${type} fetch skipped:`, error instanceof Error ? error.message : error);
    }
  }

  if (records.length === 0) {
    throw new Error('FHIR sync returned no records. Confirm patient scopes and sandbox access.');
  }

  return records.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 50);
};

const liveTokenExchange = async (code, codeVerifier, env) => {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: env.redirectUri,
    client_id: env.clientId,
    code_verifier: codeVerifier,
  });
  if (env.clientSecret) body.set('client_secret', env.clientSecret);

  const response = await fetch(env.tokenBase, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || 'Token exchange failed');
  }
  return payload;
};

const liveRefreshToken = async (refreshToken, env) => {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: env.clientId,
  });
  if (env.clientSecret) body.set('client_secret', env.clientSecret);

  const response = await fetch(env.tokenBase, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || 'Token refresh failed');
  }
  return payload;
};

const tokenBundleFromPayload = (payload, env) => ({
  accessToken: payload.access_token || '',
  refreshToken: payload.refresh_token || '',
  tokenExpiresAt: payload.expires_in ? new Date(Date.now() + Number(payload.expires_in) * 1000).toISOString() : '',
  fhirBaseUrl: payload.fhir_base || env.fhirBase,
  patientId: payload.patient || 'me',
});

export const healthPortalOAuthStart = (household, portalId, stateToken = '', codeVerifier = '') => {
  const catalog = PORTAL_CATALOG[portalId];
  if (!catalog) throw new Error('Unknown health portal');
  if (catalog.authMode !== 'oauth_smart') {
    throw new Error('This portal does not use OAuth');
  }

  const env = healthPortalEnvConfig(catalog.oauthProvider);
  const portals = ensureHealthPortals(household);
  const verifier = codeVerifier || createPkcePair().codeVerifier;
  const codeChallenge = createHash('sha256').update(verifier).digest('base64url');

  if (!env.useLiveMode) {
    const mockRedirect = `${env.redirectUri}?code=mock-${encodeURIComponent(stateToken)}&state=${encodeURIComponent(stateToken)}`;
    portals[portalId] = sealPortalTokens({
      ...portals[portalId],
      portalId,
      authMode: 'oauth_smart',
      configStatus: 'mock',
      status: 'pending',
      syncStatus: 'authorizing',
      authorizePath: mockRedirect,
      oauthRedirectPath: '/api/health-portal/oauth/callback',
      message: 'Mock Epic OAuth — completing authorization…',
    });
    return { portals, redirectUrl: mockRedirect, codeVerifier: verifier };
  }

  if (!env.ready) {
    portals[portalId] = sealPortalTokens({
      ...portals[portalId],
      authMode: 'oauth_smart',
      configStatus: 'missing',
      status: 'disconnected',
      missingConfig: env.missingConfig,
      message: 'Epic OAuth is not configured. Add T1D_EPIC_CLIENT_ID or use mock mode.',
    });
    return { portals, redirectUrl: '', codeVerifier: verifier };
  }

  const authorizeUrl = `${env.authorizeBase}?response_type=code&client_id=${encodeURIComponent(env.clientId)}&redirect_uri=${encodeURIComponent(env.redirectUri)}&scope=${encodeURIComponent(EPIC_SCOPES)}&state=${encodeURIComponent(stateToken)}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256&aud=${encodeURIComponent(env.fhirBase)}`;

  portals[portalId] = sealPortalTokens({
    ...portals[portalId],
    portalId,
    authMode: 'oauth_smart',
    configStatus: env.useLiveMode ? 'ready' : 'mock',
    status: 'pending',
    syncStatus: 'authorizing',
    authorizePath: authorizeUrl,
    oauthRedirectPath: '/api/health-portal/oauth/callback',
    message: env.useLiveMode
      ? 'Redirect to Epic MyChart to authorize read-only access to your records.'
      : 'Mock Epic OAuth ready — finish redirect to simulate authorization.',
  });

  return { portals, redirectUrl: authorizeUrl, codeVerifier: verifier };
};

export const healthPortalOAuthCallback = async (household, portalId, code = '', codeVerifier = '') => {
  const catalog = PORTAL_CATALOG[portalId];
  if (!catalog) throw new Error('Unknown health portal');

  const env = healthPortalEnvConfig(catalog.oauthProvider);
  const portals = ensureHealthPortals(household);
  const now = nowIso();

  if (env.useLiveMode && code && codeVerifier) {
    try {
      const payload = await liveTokenExchange(code, codeVerifier, env);
      const tokens = tokenBundleFromPayload(payload, env);
      portals[portalId] = sealPortalTokens({
        ...portals[portalId],
        portalId,
        status: 'connected',
        authMode: 'oauth_smart',
        configStatus: 'ready',
        connectedAt: now,
        lastSyncAt: null,
        nextSyncDueAt: now,
        syncStatus: 'syncing',
        autoSyncState: 'scheduled',
        ...tokens,
        message: 'Epic MyChart authorized. Starting FHIR sync…',
      });
      return { portals };
    } catch (error) {
      portals[portalId] = {
        ...portals[portalId],
        status: 'error',
        syncStatus: 'error',
        message: error instanceof Error ? error.message : 'OAuth callback failed',
      };
      return { portals };
    }
  }

  const mockToken = `mock-${randomBytes(8).toString('hex')}`;
  portals[portalId] = sealPortalTokens({
    ...portals[portalId],
    portalId,
    status: 'connected',
    authMode: 'oauth_smart',
    configStatus: 'mock',
    connectedAt: now,
    nextSyncDueAt: now,
    syncStatus: 'syncing',
    autoSyncState: 'scheduled',
    accessToken: mockToken,
    refreshToken: `refresh-${mockToken}`,
    tokenExpiresAt: nextSyncAt(3600),
    fhirBaseUrl: env.fhirBase,
    patientId: 'me',
    message: code
      ? 'Mock Epic OAuth completed. FHIR sync will use demo records until live credentials are set.'
      : 'Mock Epic connection established.',
  });
  return { portals };
};

export const refreshHealthPortalToken = async (household, portalId) => {
  const catalog = PORTAL_CATALOG[portalId];
  if (!catalog) throw new Error('Unknown health portal');

  const env = healthPortalEnvConfig(catalog.oauthProvider);
  const portals = ensureHealthPortals(household);
  const current = unsealPortalConnection(portals[portalId]);

  if (!env.useLiveMode) {
    portals[portalId] = sealPortalTokens({
      ...current,
      tokenExpiresAt: nextSyncAt(3600),
      message: 'Mock token refreshed.',
    });
    return { portals };
  }

  if (!current.refreshToken) throw new Error('No refresh token available');

  const payload = await liveRefreshToken(current.refreshToken, env);
  const tokens = tokenBundleFromPayload({ ...payload, refresh_token: payload.refresh_token || current.refreshToken }, env);
  portals[portalId] = sealPortalTokens({
    ...current,
    ...tokens,
    message: 'Access token refreshed.',
  });
  return { portals };
};

export const connectHealthPortal = (household, portalId) => {
  const catalog = PORTAL_CATALOG[portalId];
  if (!catalog) throw new Error('Unknown health portal');
  if (catalog.authMode === 'oauth_smart') {
    throw new Error('Use OAuth flow for this portal');
  }

  const portals = ensureHealthPortals(household);
  const now = nowIso();
  portals[portalId] = {
    ...portals[portalId],
    status: 'connected',
    connectedAt: now,
    lastSyncAt: null,
    nextSyncDueAt: now,
    syncStatus: 'syncing',
    message: `Connected to ${catalog.name}. Initial sync started.`,
    recordCount: 0,
    records: [],
    autoSyncState: 'scheduled',
  };
  return { portals, catalog };
};

export const syncHealthPortal = async (household, portalId, source = 'manual') => {
  const catalog = PORTAL_CATALOG[portalId];
  if (!catalog) throw new Error('Unknown health portal');

  const portals = ensureHealthPortals(household);
  const current = portals[portalId];
  if (current.status !== 'connected') {
    throw new Error('Portal is not connected');
  }

  const env = healthPortalEnvConfig(catalog.oauthProvider);
  const patientName = household.childName || household.primaryParent || 'Member';
  const now = nowIso();
  let records = mockRecordsForPortal(portalId, patientName);
  let message = `Synced ${records.length} records from ${catalog.name}.`;

  if (catalog.authMode === 'oauth_smart' && env.useLiveMode && unsealPortalConnection(current).accessToken) {
    try {
      records = await fetchFhirRecordsLive(current, env);
      message = `Live FHIR sync: ${records.length} records from ${catalog.name}.`;
    } catch (error) {
      portals[portalId] = {
        ...current,
        lastSyncAt: now,
        nextSyncDueAt: nextSyncAt(env.syncIntervalSeconds),
        syncStatus: 'error',
        autoSyncState: source === 'background' ? 'retrying' : 'idle',
        message: error instanceof Error ? error.message : 'FHIR sync failed',
      };
      return { portals, records: current.records || [] };
    }
  }

  portals[portalId] = {
    ...current,
    lastSyncAt: now,
    nextSyncDueAt: nextSyncAt(env.syncIntervalSeconds),
    syncStatus: 'live',
    recordCount: records.length,
    records,
    autoSyncState: 'scheduled',
    message: source === 'background' ? `${message} (auto-sync)` : message,
  };

  return { portals, records };
};

export const disconnectHealthPortal = (household, portalId) => {
  const portals = ensureHealthPortals(household);
  portals[portalId] = defaultPortalState(portalId);
  return { portals };
};

export const shouldRunBackgroundHealthPortalSync = (household) => {
  const portals = ensureHealthPortals(household);
  return Object.values(portals).some((portal) => {
    if (portal.status !== 'connected') return false;
    if (!portal.nextSyncDueAt) return false;
    const dueAt = Date.parse(portal.nextSyncDueAt);
    return Number.isFinite(dueAt) && dueAt <= Date.now();
  });
};

export const buildHealthRecordsSummary = (household) => {
  if (!household) {
    return {
      connectedCount: 0,
      totalRecords: 0,
      lastSyncAt: null,
      portals: listHealthPortalCatalog().map((entry) => ({ ...entry, connection: defaultPortalState(entry.id) })),
      unifiedTimeline: [],
      byType: {},
      syncHealth: 'none',
      autoSyncEnabled: true,
      nextAutoSyncAt: null,
    };
  }
  const portals = ensureHealthPortals(household);
  const catalog = Object.values(PORTAL_CATALOG).map((entry) => ({
    ...entry,
    connection: {
      ...portals[entry.id],
      accessToken: undefined,
      refreshToken: undefined,
      accessTokenSealed: portals[entry.id].accessTokenSealed ? '[sealed]' : '',
      refreshTokenSealed: portals[entry.id].refreshTokenSealed ? '[sealed]' : '',
    },
  }));

  const allRecords = Object.values(portals).flatMap((portal) => portal.records || []);
  const connectedCount = Object.values(portals).filter((p) => p.status === 'connected').length;
  const lastSync = allRecords.map((r) => Date.parse(r.date)).filter(Number.isFinite).sort((a, b) => b - a)[0];
  const nextDue = Object.values(portals)
    .map((p) => Date.parse(p.nextSyncDueAt || ''))
    .filter(Number.isFinite)
    .sort((a, b) => a - b)[0];

  const unifiedTimeline = [...allRecords].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 40);
  const byType = unifiedTimeline.reduce((acc, record) => {
    acc[record.type] = (acc[record.type] || 0) + 1;
    return acc;
  }, {});

  return {
    connectedCount,
    totalRecords: allRecords.length,
    lastSyncAt: lastSync ? new Date(lastSync).toISOString() : null,
    nextAutoSyncAt: nextDue ? new Date(nextDue).toISOString() : null,
    autoSyncEnabled: true,
    portals: catalog,
    unifiedTimeline,
    byType,
    syncHealth: connectedCount === 0 ? 'none' : connectedCount >= 2 ? 'strong' : 'partial',
    liveMode: healthPortalEnvConfig().useLiveMode,
  };
};

export const listHealthPortalCatalog = () => Object.values(PORTAL_CATALOG);

export const getPortalCatalogEntry = (portalId) => PORTAL_CATALOG[portalId] || null;
