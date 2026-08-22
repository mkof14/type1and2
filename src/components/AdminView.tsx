import React from 'react';
import { AdminConsole } from './admin/AdminConsole';
import type { T1DTheme } from '../lib/t1d-ui';

interface AdminViewProps {
  theme: T1DTheme;
  setTheme: (theme: 'light' | 'dark') => void;
  onBackToPublic: () => void;
  isSuperAdmin?: boolean;
}

export const AdminView: React.FC<AdminViewProps> = (props) => <AdminConsole {...props} />;
