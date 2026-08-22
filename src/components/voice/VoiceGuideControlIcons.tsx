import React from 'react';

type IconProps = { size?: number; className?: string };

export const VoiceMicIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
    <path d="M6 11a6 6 0 0 0 12 0M12 17v3.5M8.5 20.5h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const VoiceMicOffIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" opacity="0.45" />
    <path d="M5 5l14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const VoiceSpeakerIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M5 10v4h4l5 4V6l-5 4H5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M16.5 9.5a4.5 4.5 0 0 1 0 5M18.5 7a7.5 7.5 0 0 1 0 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const VoiceSpeakerOffIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M5 10v4h4l5 4V6l-5 4H5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" opacity="0.45" />
    <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const VoiceSendIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M4 12l16-7-7 16-2-6-7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
