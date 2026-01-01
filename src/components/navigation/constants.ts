import { NavItem } from '@/components/navigation/types';

export const getNavItems = (
  t: (key: string) => string,
  locale: string,
): NavItem[] => [
  {
    id: 'home',
    label: t('home'),
    href: `/${locale}`,
  },
  {
    id: 'entrepreneurship-incubators',
    label: t('entrepreneurshipAndIncubators'),
    href: `/${locale}/entrepreneurship`,
    children: [
      {
        label: t('entrepreneurship'),
        href: `/${locale}/entrepreneurship`,
        description: t('entrepreneurshipDesc'),
      },
      {
        label: t('incubators'),
        href: `/${locale}/incubators`,
        description: t('incubatorsDesc'),
      },
      {
        label: t('segments'),
        href: `/${locale}/segments`,
        description: t('segmentsDesc'),
      },
    ],
  },
  {
    id: 'collaborators',
    label: t('collaboratingPartners'),
    href: `/${locale}/collaborators`,
    children: [
      {
        label: t('registerCompany'),
        href: `/${locale}/collaborators/registration/1`,
        description: t('registerCompanyDesc'),
      },
      {
        label: t('partnersList'),
        href: `/${locale}/collaborators`,
        description: t('partnersListDesc'),
      },
    ],
  },
  {
    id: 'innovators',
    label: t('CreatorsAndInnovators'),
    href: `/${locale}/innovators`,
    children: [
      {
        label: t('registerInnovator'),
        href: `/${locale}/innovators/registration/1`,
        description: t('registerInnovatorDesc'),
      },
      {
        label: t('innovatorsList'),
        href: `/${locale}/innovators`,
        description: t('innovatorsListDesc'),
      },
    ],
  },
  {
    id: 'contact',
    label: t('contact'),
    href: `/${locale}/contact`,
  },
];
