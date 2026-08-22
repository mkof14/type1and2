import React from 'react';
import { BRAND_LOGO_MARK, BRAND_LOGO_WORDMARK, PRODUCT_NAME } from '../content/brand';

export type BrandLogoDensity = 'header' | 'footer' | 'auth' | 'auth-xl' | 'default';

export type BrandLogoProps = {
  variant?: 'full' | 'mark' | 'wordmark';
  density?: BrandLogoDensity;
  className?: string;
  isRTL?: boolean;
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  density = 'default',
  className = '',
  isRTL = false,
}) => {
  const showMark = variant === 'full' || variant === 'mark';
  const showWordmark = variant === 'full' || variant === 'wordmark';
  const densityClass = density !== 'default' ? `t1d-brand-logo--${density}` : '';

  return (
    <div className={`t1d-brand-logo ${densityClass} ${isRTL ? 't1d-brand-logo--rtl' : ''} ${className}`.trim()}>
      {showMark ? (
        <img
          src={BRAND_LOGO_MARK}
          alt={PRODUCT_NAME}
          className="t1d-brand-logo__mark"
          decoding="async"
        />
      ) : null}
      {showWordmark ? (
        <img
          src={BRAND_LOGO_WORDMARK}
          alt="type1and2"
          className="t1d-brand-logo__wordmark"
          decoding="async"
        />
      ) : null}
    </div>
  );
};
