import { Bell, User } from 'lucide-react';

export const SETTINGS_OPTIONS = [
  {
    id: 'notifications',
    title: 'Notification Preferences',
    description: 'Set up global alert and notification rules',
    href: '/admin/settings/notifications',
    icon: Bell,
    disabled: false,
  },
  {
    id: 'profile',
    title: 'Profile Configuration',
    description: 'Manage user profile and account settings',
    href: '#',
    icon: User,
    disabled: true,
  },
] as const;
