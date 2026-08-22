const STRIPE_SECRET_KEY = String(process.env.STRIPE_SECRET_KEY || '').trim();

const PRICE_ENV_MAP = {
  member_monthly: 'STRIPE_PRICE_MEMBER_MONTHLY',
  member_yearly: 'STRIPE_PRICE_MEMBER_YEARLY',
  family_plus_monthly: 'STRIPE_PRICE_FAMILY_PLUS_MONTHLY',
  family_plus_yearly: 'STRIPE_PRICE_FAMILY_PLUS_YEARLY',
};

export const billingEnvConfig = () => ({
  enabled: Boolean(STRIPE_SECRET_KEY),
  publishableKey: String(process.env.STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLISHABLE_KEY || '').trim(),
  priceIds: Object.fromEntries(
    Object.entries(PRICE_ENV_MAP).map(([key, envName]) => [key, String(process.env[envName] || '').trim()]),
  ),
});

let stripeClient = null;

const getStripe = async () => {
  if (!STRIPE_SECRET_KEY) return null;
  if (!stripeClient) {
    const Stripe = (await import('stripe')).default;
    stripeClient = new Stripe(STRIPE_SECRET_KEY);
  }
  return stripeClient;
};

export const resolveStripePriceId = (priceKey) => {
  const envName = PRICE_ENV_MAP[priceKey];
  if (!envName) return '';
  return String(process.env[envName] || '').trim();
};

export const createCheckoutSession = async ({
  priceKey,
  user,
  siteUrl,
  lang = 'en',
}) => {
  const stripe = await getStripe();
  if (!stripe) {
    return { ok: false, error: 'stripe_not_configured' };
  }

  const priceId = resolveStripePriceId(priceKey);
  if (!priceId) {
    return { ok: false, error: 'price_not_configured', priceKey };
  }

  const successUrl = `${siteUrl.replace(/\/$/, '')}/pricing?checkout=success`;
  const cancelUrl = `${siteUrl.replace(/\/$/, '')}/pricing?checkout=cancel`;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: user?.email || undefined,
    client_reference_id: user?.id || undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: 14,
      metadata: {
        userId: user?.id || '',
        priceKey,
        lang,
      },
    },
    metadata: {
      userId: user?.id || '',
      priceKey,
    },
  });

  return { ok: true, url: session.url, sessionId: session.id };
};

export const getBillingStatus = () => {
  const config = billingEnvConfig();
  const configuredPrices = Object.values(config.priceIds).filter(Boolean).length;
  return {
    enabled: config.enabled && configuredPrices > 0,
    publishableKey: config.publishableKey,
    configuredPrices,
    totalPrices: Object.keys(PRICE_ENV_MAP).length,
  };
};
