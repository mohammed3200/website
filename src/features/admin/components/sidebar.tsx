'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Users,
  ClipboardList,
  FileBarChart,
  Settings,
  Newspaper,
  Target,
  Mail,
  Bell,
} from 'lucide-react';

const navigation = [
  {
    name: { en: 'Overview', ar: 'لوحة التحكم' },
    href: '#LOCALE#/admin',
    icon: LayoutDashboard,
  },
  {
    name: { en: 'Submissions', ar: 'الطلبات' },
    href: '#LOCALE#/admin/submissions',
    icon: ClipboardList,
  },
  {
    name: { en: 'Content', ar: 'المحتوى' },
    href: '#LOCALE#/admin/content',
    icon: FileText,
  },
  {
    name: { en: 'Strategic Plans', ar: 'الخطط الاستراتيجية' },
    href: '#LOCALE#/admin/strategic-plans',
    icon: Target,
  },
  {
    name: { en: 'News', ar: 'الأخبار' },
    href: '#LOCALE#/admin/news',
    icon: Newspaper,
  },
  {
    name: { en: 'Templates', ar: 'القوالب' },
    href: '#LOCALE#/admin/templates',
    icon: Mail,
  },
  {
    name: { en: 'Notifications', ar: 'الإشعارات' },
    href: '#LOCALE#/admin/notifications',
    icon: Bell,
  },
  {
    name: { en: 'Reports', ar: 'التقارير' },
    href: '#LOCALE#/admin/reports',
    icon: FileBarChart,
  },
  {
    name: { en: 'FAQs', ar: 'الأسئلة الشائعة' },
    href: '#LOCALE#/admin/faqs',
    icon: FileText,
  },
  {
    name: { en: 'Settings', ar: 'الإعدادات' },
    href: '#LOCALE#/admin/settings',
    icon: Settings,
  },
];

export default function Sidebar({ locale }: { locale?: string }) {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-xl font-bold text-primary">
            {locale === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const href = item.href.replace(
                    '#LOCALE#',
                    locale ? `/${locale}` : '',
                  );
                  const isActive =
                    pathname === href ||
                    (href !== `/${locale}/admin` &&
                      pathname.startsWith(href + '/'));

                  return (
                    <li key={item.name.en}>
                      <Link
                        href={href}
                        className={cn(
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors',
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive
                              ? 'text-white'
                              : 'text-gray-400 group-hover:text-primary',
                            'h-6 w-6 shrink-0',
                          )}
                          aria-hidden="true"
                        />
                        {item.name[((locale as any) || 'en') as 'en' | 'ar'] ??
                          item.name.en}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
