import { Bell, User } from 'lucide-react';

export const SETTINGS_OPTIONS = [
  {
    titleKey: 'notifications.title',
    descriptionKey: 'notifications.description',
    href: '/admin/settings/notifications',
    icon: Bell,
    disabled: false,
  },
  {
    titleKey: 'profile.title',
    descriptionKey: 'profile.description',
    href: '#',
    icon: User,
    disabled: true,
  },
] as const;
