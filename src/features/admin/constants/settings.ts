import { Bell, User, type LucideIcon } from 'lucide-react';

type EnabledSetting = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  href: string;
  icon: LucideIcon;
  disabled?: false;
};

type DisabledSetting = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  href?: undefined;
  icon: LucideIcon;
  disabled: true;
};

type Setting = EnabledSetting | DisabledSetting;

export const SETTINGS_OPTIONS: readonly Setting[] = [
  {
    id: 'notifications',
    titleKey: 'notifications.title',
    descriptionKey: 'notifications.description',
    href: '/admin/settings/notifications',
    icon: Bell,
    disabled: false,
  },
  {
    id: 'profile',
    titleKey: 'profile.title',
    descriptionKey: 'profile.description',
    icon: User,
    disabled: true,
  },
] as const;
