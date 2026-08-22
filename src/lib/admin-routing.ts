export type AdminSectionId =
  | 'overview'
  | 'support'
  | 'settings'
  | 'permissions'
  | 'invitations'
  | 'marketing'
  | 'email-templates'
  | 'monitoring'
  | 'analytics'
  | 'finance';

export const ADMIN_SECTIONS: AdminSectionId[] = [
  'overview',
  'support',
  'invitations',
  'marketing',
  'email-templates',
  'analytics',
  'finance',
  'monitoring',
  'permissions',
  'settings',
];

export const adminPathForSection = (section: AdminSectionId) =>
  section === 'overview' ? '/admin' : `/admin/${section}`;

export const resolveAdminSection = (pathname: string): AdminSectionId => {
  const segment = pathname.replace(/^\/admin\/?/, '').split('/')[0];
  if (!segment) return 'overview';
  if (ADMIN_SECTIONS.includes(segment as AdminSectionId)) return segment as AdminSectionId;
  return 'overview';
};

export const isAdminPath = (pathname: string) => pathname === '/admin' || pathname.startsWith('/admin/');
