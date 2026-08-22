import React from 'react';
import { PageHeroBanner, type PageHeroBannerProps } from './PageHeroBanner';

/** Full-bleed member hero — same glass-on-photo treatment as public pages. */
export const MemberPageHero: React.FC<PageHeroBannerProps> = ({ className = '', ...props }) => (
  <PageHeroBanner
    {...props}
    bleed
    priority
    compact={false}
    className={`t1d-page-hero--public t1d-page-hero--member ${className}`.trim()}
  />
);
