import { Bell, User, Scale, type LucideIcon } from 'lucide-react';

type EnabledSetting = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  href: string;
  icon: LucideIcon;
  disabled: false;
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

export const SETTINGS_OPTIONS = [
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
    href: '/admin/settings/profile',
    icon: User,
    disabled: false,
  },
  {
    id: 'legal-content',
    titleKey: 'legalContent.title',
    descriptionKey: 'legalContent.description',
    href: '/admin/settings/legal-content',
    icon: Scale,
    disabled: false,
  },
] as const satisfies readonly Setting[];
