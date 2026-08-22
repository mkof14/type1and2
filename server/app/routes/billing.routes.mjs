import { createCheckoutSession, getBillingStatus } from '../../services/billing-service.mjs';

const VALID_PRICE_KEYS = new Set([
  'member_monthly',
  'member_yearly',
  'family_plus_monthly',
  'family_plus_yearly',
]);

export const handleBillingRoutes = async (ctx) => {
  const {
    req,
    res,
    url,
    lang,
    sendJson,
    readBody,
    BODY_TOO_LARGE,
    findSessionUser,
    billingRateLimit,
    clientIp,
    t,
    safeText,
    SITE_URL,
  } = ctx;

  if (url.pathname === '/api/billing/status' && req.method === 'GET') {
    sendJson(res, 200, getBillingStatus());
    return true;
  }

  if (url.pathname === '/api/billing/checkout' && req.method === 'POST') {
    const limit = await billingRateLimit(clientIp(req));
    if (!limit.allowed) {
      sendJson(res, 429, { error: t(lang, 'rateLimited') });
      return true;
    }

    const session = await findSessionUser(req);
    if (!session?.user) {
      sendJson(res, 401, { error: 'Sign in required' });
      return true;
    }

    const body = await readBody(req);
    if (body === BODY_TOO_LARGE) {
      sendJson(res, 413, { error: 'Request body too large' });
      return true;
    }

    const priceKey = safeText(body?.priceKey, 64);
    if (!VALID_PRICE_KEYS.has(priceKey)) {
      sendJson(res, 400, { error: 'Invalid plan' });
      return true;
    }

    const result = await createCheckoutSession({
      priceKey,
      user: session.user,
      siteUrl: SITE_URL,
      lang,
    });

    if (!result.ok) {
      sendJson(res, 503, {
        error: result.error,
        priceKey: result.priceKey,
        message: result.error === 'stripe_not_configured'
          ? 'Stripe is not configured on this server'
          : 'Price ID missing in server environment',
      });
      return true;
    }

    sendJson(res, 200, { url: result.url, sessionId: result.sessionId });
    return true;
  }

  return false;
};
