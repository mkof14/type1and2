import React from 'react';
import { Camera, Leaf, Sparkles, UtensilsCrossed } from 'lucide-react';
import { LANDING_NUTRITION_COPY, LANDING_NUTRITION_DEMO } from '../../content/landing-nutrition-copy';
import { NUTRITION_COPY } from '../../content/nutrition-copy';
import type { Language } from '../../types';

interface LandingNutritionShowcaseProps {
  lang: Language;
  theme: 'light' | 'dark';
  isRTL: boolean;
}

const MACRO_STOPS = [
  { key: 'carbs' as const, accent: '#14b8a6', max: 60 },
  { key: 'protein' as const, accent: '#2563eb', max: 40 },
  { key: 'fiber' as const, accent: '#34d399', max: 15 },
  { key: 'calories' as const, accent: '#f97316', max: 600 },
];

export const LandingNutritionShowcase: React.FC<LandingNutritionShowcaseProps> = ({ lang, theme, isRTL }) => {
  const copy = LANDING_NUTRITION_COPY[lang];
  const nutrition = NUTRITION_COPY[lang];
  const demo = LANDING_NUTRITION_DEMO;
  const shellClass = theme === 'dark' ? 't1d-landing-nutrition t1d-landing-nutrition--dark' : 't1d-landing-nutrition t1d-landing-nutrition--light';
  const subtle = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';

  const macroLabels: Record<(typeof MACRO_STOPS)[number]['key'], string> = {
    carbs: nutrition.carbs,
    protein: nutrition.protein,
    fiber: nutrition.fiber,
    calories: nutrition.calories,
  };

  return (
    <section className={shellClass} aria-labelledby="landing-nutrition-title">
      <div className={`t1d-landing-nutrition__grid ${isRTL ? 't1d-landing-nutrition__grid--rtl' : ''}`}>
        <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          <p className="t1d-landing-nutrition__eyebrow">
            <Sparkles size={14} className={`inline-block align-[-2px] ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {copy.eyebrow}
          </p>
          <h2 id="landing-nutrition-title" className={`text-xl md:text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-slate-50' : 'text-stone-900'}`}>
            {copy.title}
          </h2>
          <p className={`max-w-xl text-sm leading-relaxed ${subtle}`}>{copy.body}</p>
          <ul className={`grid gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {copy.features.map((feature) => (
              <li
                key={feature}
                className={`t1d-landing-nutrition__feature ${theme === 'dark' ? 't1d-landing-nutrition__feature--dark' : ''}`}
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className={`t1d-landing-nutrition__demo ${theme === 'dark' ? 't1d-landing-nutrition__demo--dark' : ''}`}>
          <div className={`t1d-meal-plate-card ${theme === 'dark' ? 't1d-meal-plate-card--dark' : 't1d-meal-plate-card--light'}`}>
            <div className={`flex items-start justify-between gap-3 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <div>
                <p className="t1d-meal-plate-card__kicker">
                  <UtensilsCrossed size={14} />
                  {copy.sampleTime}
                </p>
                <p className="t1d-meal-plate-card__title">{copy.sampleMeal}</p>
              </div>
              <span className="t1d-meal-plate-card__impact">{copy.impactValue}</span>
            </div>

            <div className="t1d-meal-plate-card__hero-metric">
              <span className={`t1d-meal-plate-card__calories ${theme === 'dark' ? 'text-slate-50' : 'text-stone-900'}`}>{demo.calories}</span>
              <span className="t1d-meal-plate-card__calories-unit">kcal</span>
            </div>

            <div className="t1d-meal-plate-card__macros">
              {MACRO_STOPS.map(({ key, accent, max }) => {
                const value = demo[key];
                const pct = Math.min(100, Math.round((value / max) * 100));
                return (
                  <div key={key} className="t1d-meal-plate-card__macro">
                    <div className={`t1d-meal-plate-card__macro-head ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span>{macroLabels[key]}</span>
                      <strong>{value}{key === 'calories' ? '' : ' g'}</strong>
                    </div>
                    <div className="t1d-meal-plate-card__macro-track">
                      <span className="t1d-meal-plate-card__macro-fill" style={{ width: `${pct}%`, background: accent }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className={`t1d-meal-plate-card__impact-note ${subtle}`}>
              <Leaf size={14} />
              {copy.impactLabel}: {copy.impactValue}
            </p>
          </div>

          <div className={`t1d-meal-scan t1d-meal-scan--brand ${theme === 'dark' ? 't1d-meal-scan--dark' : 't1d-meal-scan--light'}`}>
            <div className={`flex items-center justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <p className="t1d-meal-scan__label">{copy.scanLabel}</p>
              <span className="t1d-meal-scan__icon">
                <Camera size={16} />
              </span>
            </div>
            <div className="t1d-meal-scan__viewport t1d-landing-nutrition__viewport">
              <div className="t1d-landing-nutrition__scan-frame t1d-landing-nutrition__scan-frame--brand">
                <span className="t1d-landing-nutrition__scan-corner t1d-landing-nutrition__scan-corner--tl t1d-landing-nutrition__scan-corner--teal" aria-hidden="true" />
                <span className="t1d-landing-nutrition__scan-corner t1d-landing-nutrition__scan-corner--tr t1d-landing-nutrition__scan-corner--orange" aria-hidden="true" />
                <span className="t1d-landing-nutrition__scan-corner t1d-landing-nutrition__scan-corner--bl t1d-landing-nutrition__scan-corner--teal" aria-hidden="true" />
                <span className="t1d-landing-nutrition__scan-corner t1d-landing-nutrition__scan-corner--br t1d-landing-nutrition__scan-corner--orange" aria-hidden="true" />
                <div className="t1d-meal-scan__hint-wrap">
                  <p className={`text-sm leading-relaxed ${subtle}`}>{copy.scanHint}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingNutritionShowcase;
