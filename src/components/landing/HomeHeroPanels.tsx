import React from 'react';
import { BellRing, Heart, HeartHandshake, Users, Workflow } from 'lucide-react';
import type { Language } from '../../types';
import { BRAND_TAGLINE } from '../../content/landing-copy';
import type { LandingTypeCopy } from '../../content/landing-type-copy';

type HomeHeroPanelsProps = {
  lang: Language;
  theme: 'light' | 'dark';
  isRTL: boolean;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroNote?: string;
  heroSecondary: string;
  onSecondaryAction: () => void;
  secondaryButtonClass: string;
  typeCopy: LandingTypeCopy;
  nightIntro: string;
  summaryTitle: string;
  summaryBody: string;
  productPoints: string[];
  architectureItems: Array<{ title: string; body: string }>;
  homeSteps: [string, string, string];
  stepBodies: [string, string, string];
  promiseCards: Array<{ value: string; Icon: React.ComponentType<{ size?: number }> }>;
  confidenceCards: Array<{ label: string; body: string }>;
  heroBadgeClass: string;
  homeChipClass: string;
  homeFlowStepClass: string;
  homeStateClass: string;
  subtleTextTone: string;
  mutedTextTone: string;
  softLabelClass: string;
};

export const HomeHeroPanels: React.FC<HomeHeroPanelsProps> = ({
  lang,
  theme,
  isRTL,
  heroEyebrow,
  heroTitle,
  heroSubtitle,
  heroNote,
  heroSecondary,
  onSecondaryAction,
  secondaryButtonClass,
  typeCopy,
  nightIntro,
  summaryTitle,
  summaryBody,
  productPoints,
  architectureItems,
  homeSteps,
  stepBodies,
  promiseCards,
  confidenceCards,
  heroBadgeClass,
  homeChipClass,
  homeFlowStepClass,
  homeStateClass,
  subtleTextTone,
  mutedTextTone,
  softLabelClass,
}) => {
  const storyTone = theme === 'dark' ? 't1d-home-hero-story--dark' : 't1d-home-hero-story--light';
  const insetTone = theme === 'dark' ? 't1d-home-hero-mini-path--dark' : 't1d-home-hero-mini-path--light';
  const benefitTone = theme === 'dark' ? 't1d-home-hero-benefit--dark' : 't1d-home-hero-benefit--light';
  const signalTone = theme === 'dark' ? 't1d-home-hero-signal--dark' : 't1d-home-hero-signal--light';

  return (
    <div className="t1d-home-grid t1d-home-grid--hero">
      <article className={`t1d-home-hero-story t1d-home-hero-story--intro ${storyTone}`}>
        <div className={`${heroBadgeClass} ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Heart size={16} />
          <span>{heroEyebrow}</span>
        </div>
        <p className={`t1d-hero-tagline ${theme === 'dark' ? 't1d-hero-tagline--dark' : ''}`}>{BRAND_TAGLINE[lang]}</p>
        <div className="space-y-3">
          <p className={`text-xl md:text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-slate-50' : 'text-stone-900'}`}>{heroTitle}</p>
          <p className={`text-base md:text-lg font-medium leading-relaxed ${subtleTextTone}`}>{heroSubtitle}</p>
          {heroNote ? <p className={`text-base font-semibold ${mutedTextTone}`}>{heroNote}</p> : null}
        </div>

        <div className="t1d-home-hero-path-grid">
          <div className={`t1d-home-hero-mini-path t1d-home-hero-mini-path--type1 ${insetTone}`}>
            <p className="t1d-home-hero-mini-path__label">{typeCopy.home.type1.label}</p>
            <p className="t1d-home-hero-mini-path__title">{typeCopy.home.type1.title}</p>
            <p className={`t1d-home-hero-mini-path__body ${subtleTextTone}`}>{typeCopy.home.type1.points[0]}</p>
          </div>
          <div className={`t1d-home-hero-mini-path t1d-home-hero-mini-path--type2 ${insetTone}`}>
            <p className="t1d-home-hero-mini-path__label">{typeCopy.home.type2.label}</p>
            <p className="t1d-home-hero-mini-path__title">{typeCopy.home.type2.title}</p>
            <p className={`t1d-home-hero-mini-path__body ${subtleTextTone}`}>{typeCopy.home.type2.points[0]}</p>
          </div>
        </div>

        <ul className={`t1d-home-hero-benefits ${isRTL ? 'text-right' : 'text-left'}`}>
          {productPoints.slice(0, 3).map((point) => (
            <li key={point} className={`t1d-home-hero-benefit ${benefitTone}`}>{point}</li>
          ))}
        </ul>

        <div className={`t1d-home-hero-signal-grid ${isRTL ? 'text-right' : 'text-left'}`}>
          {architectureItems.slice(0, 2).map((item) => (
            <div key={item.title} className={`t1d-home-hero-signal ${signalTone}`}>
              <Workflow size={15} className="t1d-home-hero-signal__icon" />
              <div>
                <p className="t1d-home-hero-signal__title">{item.title}</p>
                <p className={`t1d-home-hero-signal__body ${mutedTextTone}`}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-auto flex flex-wrap gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button type="button" onClick={onSecondaryAction} className={secondaryButtonClass}>
            {heroSecondary}
          </button>
        </div>

        <div className="t1d-home-chip-row">
          {promiseCards.map(({ value, Icon }) => (
            <span key={value} className={homeChipClass}>
              <Icon size={15} />
              {value}
            </span>
          ))}
        </div>
      </article>

      <article className={`t1d-home-hero-story t1d-home-hero-story--flow ${storyTone}`}>
        <div className={`flex items-start justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <p className={softLabelClass}>{summaryTitle}</p>
            <p className="mt-2 text-xl md:text-2xl font-bold tracking-tight leading-snug">{summaryBody}</p>
          </div>
          <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${theme === 'dark' ? 'bg-orange-400/12 text-orange-200' : 'bg-orange-100 text-orange-700'}`}>
            <BellRing size={20} />
          </span>
        </div>
        <p className={`text-base leading-relaxed ${subtleTextTone}`}>{nightIntro}</p>

        <div className="t1d-home-flow t1d-home-flow--hero">
          {homeSteps.map((step, index) => (
            <div key={step} className={homeFlowStepClass}>
              <span className={`t1d-home-flow__index t1d-home-flow__index--${index === 0 ? 'type1' : index === 1 ? 'blend' : 'type2'}`}>
                {index + 1}
              </span>
              <div>
                <p className="text-base font-black tracking-tight">{step}</p>
                <p className={`mt-1 text-base leading-relaxed ${subtleTextTone}`}>{stepBodies[index]}</p>
              </div>
              <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${theme === 'dark' ? 'bg-amber-400/12 text-amber-200' : 'bg-orange-100 text-orange-800'}`}>
                {index === 0 ? <BellRing size={16} /> : index === 1 ? <Users size={16} /> : <HeartHandshake size={16} />}
              </span>
            </div>
          ))}
        </div>

        <div className="t1d-home-states t1d-home-states--hero">
          {confidenceCards.map((item) => (
            <div key={item.label} className={`${homeStateClass} t1d-home-state--hero`}>
              <p className="text-sm font-bold leading-snug">{item.label}</p>
              <p className={`mt-1 text-sm leading-snug font-semibold md:text-base ${subtleTextTone}`}>{item.body}</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
};

export default HomeHeroPanels;
