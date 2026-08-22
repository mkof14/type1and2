import React, { useId } from 'react';

type VoiceGuideMarkProps = {
  size?: number;
  className?: string;
};

/** Voice Guide mark — speech bubble + microphone + sound waves (readable from 20px up). */
export const VoiceGuideMark: React.FC<VoiceGuideMarkProps> = ({ size = 24, className = '' }) => {
  const gradId = useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="16" cy="16" r="15" fill={`url(#${gradId})`} />
      <circle cx="16" cy="16" r="15" stroke="rgba(194, 120, 58, 0.22)" strokeWidth="0.75" />

      <path
        d="M8.5 8.5h13.5a2.4 2.4 0 0 1 2.4 2.4v6.2a2.4 2.4 0 0 1-2.4 2.4h-6.8l-2.6 2.6v-2.6H8.5a2.4 2.4 0 0 1-2.4-2.4v-6.2a2.4 2.4 0 0 1 2.4-2.4z"
        fill="#fffbf7"
        stroke="#c2783a"
        strokeWidth="0.85"
        strokeLinejoin="round"
      />

      <rect x="13.6" y="11.8" width="4.8" height="7.2" rx="2.4" fill="#0d9488" />
      <path
        d="M12.2 17.8a4.2 4.2 0 0 0 7.6 0"
        stroke="#0d9488"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path d="M16 19.2v2.1" stroke="#0d9488" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M13.8 21.3h4.4" stroke="#0d9488" strokeWidth="1.25" strokeLinecap="round" />

      <path
        d="M22.2 13.2c1.6 1 2.5 2.4 2.5 4 0 1.6-0.9 3-2.5 4"
        stroke="#ea580c"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path
        d="M24.4 11.2c2.4 1.5 3.8 3.6 3.8 6 0 2.4-1.4 4.5-3.8 6"
        stroke="#ea580c"
        strokeWidth="1.45"
        strokeLinecap="round"
        opacity="0.72"
      />

      <defs>
        <radialGradient id={gradId} cx="0.32" cy="0.22" r="0.88">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="100%" stopColor="#ccfbf1" />
        </radialGradient>
      </defs>
    </svg>
  );
};
