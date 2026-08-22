import type { AdminSectionId } from '../lib/admin-routing';

export const ADMIN_NAV: Record<AdminSectionId, { label: string; group: string; description: string }> = {
  overview: { label: 'Overview', group: 'Operations', description: 'Service health, households, and live counts.' },
  support: { label: 'Support', group: 'People', description: 'Member tickets and response queue.' },
  invitations: { label: 'Invitations', group: 'Growth', description: 'Email invite campaigns and marketing sends.' },
  marketing: { label: 'Marketing assets', group: 'Growth', description: 'Presentations, videos, and brand documents.' },
  'email-templates': { label: 'Email templates', group: 'Growth', description: 'Branded templates for every lifecycle moment.' },
  analytics: { label: 'Marketing analytics', group: 'Insights', description: 'Traffic, channels, and campaign performance.' },
  finance: { label: 'Finance', group: 'Insights', description: 'Users, revenue, refunds, and subscriptions.' },
  monitoring: { label: 'Technical monitoring', group: 'Platform', description: 'Runtime, storage, jobs, and environment.' },
  permissions: { label: 'Admin permissions', group: 'Platform', description: 'Roles, scopes, and admin users.' },
  settings: { label: 'Settings', group: 'Platform', description: 'Site, email, security, and feature flags.' },
};

export const ADMIN_ACTIONS = {
  view: 'View',
  copy: 'Copy',
  share: 'Share',
  send: 'Send',
  download: 'Download',
  print: 'Print',
  pdf: 'PDF',
  refresh: 'Refresh',
  backToSite: 'Back to site',
  signOutToken: 'Clear token',
  unlock: 'Unlock console',
  tokenHint: 'Bearer secret from T1D_CRON_SECRET or T1D_ADMIN_SECRET',
  superAdminHint: 'Signed in as super admin — session access enabled.',
  consoleTitle: 'Admin Console',
  consoleEyebrow: 'Type1 and 2 Operations',
};
