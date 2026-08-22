import React, { useEffect, useState } from 'react';
import { Check, Minus, Sparkles, X } from 'lucide-react';
import type { Language } from '../../types';
import type { SignupDiabetesChoice } from '../../lib/signup-diabetes-type';
import { t1dBtnPrimary, t1dBtnSecondary, type T1DTheme } from '../../lib/t1d-ui';
import {
  PRICING_COPY,
  annualSavingsPercent,
  type BillingInterval,
  type PaidPlanId,
  type PricingPlan,
} from '../../content/pricing-copy';
import { createBillingCheckout, getBillingStatus, getSession } from '../../lib/api';

type PricingPageProps = {
  lang: Language;
  theme: T1DTheme;
  isRTL?: boolean;
  onSignIn: () => void;
  onSignUp: (choice: SignupDiabetesChoice) => void;
  checkoutQuery?: string | null;
};

const formatMonthlyEquivalent = (yearly: number) => `$${(yearly / 12).toFixed(0)}`;

export const PricingPage: React.FC<PricingPageProps> = ({
  lang,
  theme,
  isRTL = false,
  onSignIn,
  onSignUp,
  checkoutQuery,
}) => {
  const copy = PRICING_COPY[lang];
  const dark = theme === 'dark';
  const [interval, setInterval] = useState<BillingInterval>('month');
  const [billingReady, setBillingReady] = useState<boolean | null>(null);
  const [busyPlan, setBusyPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    void getBillingStatus()
      .then((status) => setBillingReady(status.enabled))
      .catch(() => setBillingReady(false));
    void getSession()
      .then((session) => setIsSignedIn(Boolean(session?.authenticated)))
      .catch(() => setIsSignedIn(false));
  }, []);

  const memberPlan = copy.plans.find((p) => p.id === 'member');
  const savings = memberPlan?.monthly && memberPlan?.yearly
    ? annualSavingsPercent(memberPlan.monthly.amount, memberPlan.yearly.amount)
    : 17;

  const handleCheckout = async (plan: PricingPlan) => {
    if (plan.id === 'free') {
      onSignUp('both');
      return;
    }
    if (!isSignedIn) {
      onSignIn();
      return;
    }
    const pricing = interval === 'year' ? plan.yearly : plan.monthly;
    if (!pricing) return;

    setCheckoutError(null);
    setBusyPlan(plan.id);
    try {
      const result = await createBillingCheckout(pricing.stripePriceKey);
      if (result.url) {
        window.location.href = result.url;
        return;
      }
      setCheckoutError(result.message || copy.checkoutError);
    } catch {
      setCheckoutError(copy.checkoutError);
    } finally {
      setBusyPlan(null);
    }
  };

  const renderCell = (value: string | boolean) => {
    if (value === true) return <Check size={18} className="t1d-pricing-compare__yes" aria-label="Included" />;
    if (value === false) return <Minus size={16} className="t1d-pricing-compare__no" aria-hidden />;
    return <span>{value}</span>;
  };

  const planSavings = (plan: PricingPlan) => {
    if (!plan.monthly || !plan.yearly) return 0;
    return plan.monthly.amount * 12 - plan.yearly.amount;
  };

  return (
    <div className={`t1d-pricing-page ${dark ? 't1d-pricing-page--dark' : ''} ${isRTL ? 'text-right' : 'text-left'}`}>
      {checkoutQuery === 'success' ? (
        <div className="t1d-pricing-banner t1d-pricing-banner--success">
          <Sparkles size={18} aria-hidden />
          <div>
            <strong>{copy.successTitle}</strong>
            <p>{copy.successBody}</p>
          </div>
        </div>
      ) : null}
      {checkoutQuery === 'cancel' ? (
        <div className="t1d-pricing-banner t1d-pricing-banner--muted">
          <X size={18} aria-hidden />
          <p>{copy.checkoutError}</p>
        </div>
      ) : null}

      <div className="t1d-pricing-toolbar t1d-pricing-toolbar--compact">
        <div className={`t1d-billing-switch ${dark ? 't1d-billing-switch--dark' : ''}`}>
          <span className={`t1d-billing-switch__label ${interval === 'month' ? 'is-active' : ''}`}>{copy.toggleMonth}</span>
          <button
            type="button"
            role="switch"
            aria-checked={interval === 'year'}
            aria-label={`${copy.toggleMonth} / ${copy.toggleYear}`}
            className="t1d-billing-switch__track"
            onClick={() => setInterval((v) => (v === 'month' ? 'year' : 'month'))}
          >
            <span className="t1d-billing-switch__thumb" />
          </button>
          <span className={`t1d-billing-switch__label ${interval === 'year' ? 'is-active' : ''}`}>
            {copy.toggleYear}
            <span className="t1d-billing-switch__save">−{savings}%</span>
          </span>
        </div>
      </div>

      {billingReady === false ? (
        <p className="t1d-pricing-demo-note">{copy.checkoutDemo}</p>
      ) : null}
      {checkoutError ? <p className="t1d-pricing-error">{checkoutError}</p> : null}

      <div className="t1d-pricing-grid t1d-pricing-grid--cards">
        {copy.plans.map((plan) => {
          const isFree = plan.id === 'free';
          const pricing = !isFree ? (interval === 'year' ? plan.yearly : plan.monthly) : null;
          const yearlySave = planSavings(plan);
          const monthlyEq = !isFree && interval === 'year' && plan.yearly
            ? formatMonthlyEquivalent(plan.yearly.amount)
            : null;
          const compareAt = !isFree && interval === 'year' && plan.monthly
            ? `$${plan.monthly.amount * 12}`
            : null;

          return (
            <article
              key={plan.id}
              className={`t1d-pricing-tier t1d-pricing-tier--card ${dark ? 't1d-pricing-tier--dark' : ''} ${plan.highlight ? 't1d-pricing-tier--highlight' : ''}`}
            >
              <div className="t1d-pricing-tier__head">
                <div>
                  <h3 className="t1d-pricing-tier__name">{plan.name}</h3>
                  {plan.highlight ? <span className="t1d-pricing-tier__ribbon">{copy.popularLabel}</span> : null}
                </div>
              </div>

              <div className="t1d-pricing-tier__price-block">
                {isFree ? (
                  <span className="t1d-pricing-tier__price">{copy.freeForever}</span>
                ) : (
                  <>
                    {compareAt ? <span className="t1d-pricing-tier__compare-at">{compareAt}</span> : null}
                    <div className="t1d-pricing-tier__price-row">
                      <span className="t1d-pricing-tier__price">{pricing?.display}</span>
                      <span className="t1d-pricing-tier__period">
                        {interval === 'year' ? copy.perYear : copy.perMonth}
                      </span>
                    </div>
                    {monthlyEq ? (
                      <p className="t1d-pricing-tier__equiv">{monthlyEq}{copy.perMonth} · {copy.billedYearly}</p>
                    ) : (
                      <p className="t1d-pricing-tier__equiv">{copy.billedMonthly}</p>
                    )}
                    {interval === 'year' && yearlySave > 0 ? (
                      <span className="t1d-pricing-tier__save">
                        {copy.saveAmountLabel.replace('${amount}', `$${yearlySave}`)}
                      </span>
                    ) : null}
                  </>
                )}
              </div>

              <p className="t1d-pricing-tier__tagline">{plan.tagline}</p>
              <ul className="t1d-pricing-tier__features">
                {plan.features.map((f) => (
                  <li key={f}><Check size={14} aria-hidden /><span>{f}</span></li>
                ))}
              </ul>
              <button
                type="button"
                disabled={Boolean(busyPlan)}
                className={plan.highlight || !isFree ? t1dBtnPrimary(theme) : t1dBtnSecondary(theme)}
                onClick={() => void handleCheckout(plan)}
              >
                {busyPlan === plan.id
                  ? copy.checkoutPending
                  : isFree
                    ? copy.ctaFree
                    : !isSignedIn
                      ? copy.ctaSignIn
                      : copy.ctaBuy}
              </button>
            </article>
          );
        })}
      </div>

      <p className="t1d-pricing-toolbar__note">{copy.note}</p>

      <section className={`t1d-pricing-compare ${dark ? 't1d-pricing-compare--dark' : ''}`}>
        <header>
          <h2>{copy.compareTitle}</h2>
          <p>{copy.compareSubtitle}</p>
        </header>
        <div className="t1d-pricing-compare__scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">{copy.plans[0]?.name}</th>
                <th scope="col">{copy.plans[1]?.name}</th>
                <th scope="col">{copy.plans[2]?.name}</th>
              </tr>
            </thead>
            <tbody>
              {copy.comparison.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.label}</th>
                  <td>{renderCell(row.starter)}</td>
                  <td>{renderCell(row.member)}</td>
                  <td>{renderCell(row.familyPlus)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`t1d-pricing-faq ${dark ? 't1d-pricing-faq--dark' : ''}`}>
        <h2>{copy.faqTitle}</h2>
        <div className="t1d-pricing-faq__grid">
          {copy.faq.map((item) => (
            <article key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
