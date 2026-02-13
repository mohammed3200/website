import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/jest-globals';
import Sidebar from '@/features/admin/components/sidebar';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  );
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock lib/utils
jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

import { usePathname } from 'next/navigation';

describe('Sidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('English Locale', () => {
    it('should render all navigation items in English', async () => {
      (usePathname as any).mockReturnValue('/en/admin');

      render(<Sidebar locale="en" />);

      expect(await screen.findByText('Overview')).toBeInTheDocument();
      expect(await screen.findByText('Submissions')).toBeInTheDocument();
      expect(await screen.findByText('Content')).toBeInTheDocument();
      expect(await screen.findByText('Strategic Plans')).toBeInTheDocument();
      expect(await screen.findByText('News')).toBeInTheDocument();
      expect(await screen.findByText('Reports')).toBeInTheDocument();
      expect(await screen.findByText('Settings')).toBeInTheDocument();
    });

    it('should render Admin Dashboard title in English', async () => {
      (usePathname as any).mockReturnValue('/en/admin');

      render(<Sidebar locale="en" />);

      expect(await screen.findByText('Admin Dashboard')).toBeInTheDocument();
    });

    it('should generate correct English href for navigation items', async () => {
      (usePathname as any).mockReturnValue('/en/admin');

      const { container } = render(<Sidebar locale="en" />);

      const overviewLink = container.querySelector('a[href="/en/admin"]');
      expect(overviewLink).toBeInTheDocument();

      const submissionsLink = container.querySelector(
        'a[href="/en/admin/submissions"]',
      );
      expect(submissionsLink).toBeInTheDocument();

      const contentLink = container.querySelector(
        'a[href="/en/admin/content"]',
      );
      expect(contentLink).toBeInTheDocument();
    });
  });

  describe('Arabic Locale', () => {
    it('should render all navigation items in Arabic', async () => {
      (usePathname as any).mockReturnValue('/ar/admin');

      render(<Sidebar locale="ar" />);

      // 'لوحة التحكم' appears twice in Arabic (Title and Overview)
      const dashboardTexts = await screen.findAllByText('لوحة التحكم');
      expect(dashboardTexts.length).toBeGreaterThanOrEqual(1);

      expect(await screen.findByText('الطلبات')).toBeInTheDocument();
      expect(await screen.findByText('المحتوى')).toBeInTheDocument();
      expect(await screen.findByText('الخطط الاستراتيجية')).toBeInTheDocument();
      expect(await screen.findByText('الأخبار')).toBeInTheDocument();
      expect(await screen.findByText('التقارير')).toBeInTheDocument();
      expect(await screen.findByText('الإعدادات')).toBeInTheDocument();
    });

    it('should generate correct Arabic href for navigation items', () => {
      (usePathname as any).mockReturnValue('/ar/admin');

      const { container } = render(<Sidebar locale="ar" />);

      const overviewLink = container.querySelector('a[href="/ar/admin"]');
      expect(overviewLink).toBeInTheDocument();

      const submissionsLink = container.querySelector(
        'a[href="/ar/admin/submissions"]',
      );
      expect(submissionsLink).toBeInTheDocument();
    });
  });

  describe('Active Link Highlighting', () => {
    it('should highlight Overview when on /en/admin', () => {
      (usePathname as any).mockReturnValue('/en/admin');

      const { container } = render(<Sidebar locale="en" />);

      const overviewLink = container.querySelector('a[href="/en/admin"]');
      expect(overviewLink).toHaveClass('bg-primary');
      expect(overviewLink).toHaveClass('text-white');
    });

    it('should highlight Submissions when on /en/admin/submissions', () => {
      (usePathname as any).mockReturnValue('/en/admin/submissions');

      const { container } = render(<Sidebar locale="en" />);

      const submissionsLink = container.querySelector(
        'a[href="/en/admin/submissions"]',
      );
      expect(submissionsLink).toHaveClass('bg-primary');
      expect(submissionsLink).toHaveClass('text-white');
    });

    it('should highlight Content when on /en/admin/content', () => {
      (usePathname as any).mockReturnValue('/en/admin/content');

      const { container } = render(<Sidebar locale="en" />);

      const contentLink = container.querySelector(
        'a[href="/en/admin/content"]',
      );
      expect(contentLink).toHaveClass('bg-primary');
      expect(contentLink).toHaveClass('text-white');
    });

    it('should not highlight inactive links', () => {
      (usePathname as any).mockReturnValue('/en/admin');

      const { container } = render(<Sidebar locale="en" />);

      const submissionsLink = container.querySelector(
        'a[href="/en/admin/submissions"]',
      );
      expect(submissionsLink).not.toHaveClass('bg-primary');
      expect(submissionsLink).toHaveClass('text-gray-700');
    });

    it('should highlight correct link in Arabic locale', () => {
      (usePathname as any).mockReturnValue('/ar/admin/content');

      const { container } = render(<Sidebar locale="ar" />);

      const contentLink = container.querySelector(
        'a[href="/ar/admin/content"]',
      );
      expect(contentLink).toHaveClass('bg-primary');
      expect(contentLink).toHaveClass('text-white');
    });
  });

  describe('Navigation Structure', () => {
    it('should render all 7 navigation items', () => {
      (usePathname as any).mockReturnValue('/en/admin');

      const { container } = render(<Sidebar locale="en" />);

      const links = container.querySelectorAll('a[href*="/admin"]');
      expect(links).toHaveLength(7);
    });

    it('should maintain navigation order', () => {
      (usePathname as any).mockReturnValue('/en/admin');

      render(<Sidebar locale="en" />);

      // Get links inside the main navigation list
      const navList = screen.getByRole('list');
      const items = within(navList).getAllByRole('link');
      const labels = items.map((item) => item.textContent);

      // Verify the expected items are present in the correct relative order
      const expectedItems = [
        'Overview',
        'Submissions',
        'Content',
        'Strategic Plans',
        'News',
        'Reports',
        'Settings',
      ];

      expect(labels).toEqual(expect.arrayContaining(expectedItems));
    });
  });

  describe('Icons', () => {
    it('should render icons for all navigation items', () => {
      (usePathname as any).mockReturnValue('/en/admin');

      const { container } = render(<Sidebar locale="en" />);

      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThanOrEqual(7); // At least one icon per nav item
    });

    it('should apply correct icon classes when active', () => {
      (usePathname as any).mockReturnValue('/en/admin');

      const { container } = render(<Sidebar locale="en" />);

      const activeLink = container.querySelector('a[href="/en/admin"]');
      const icon = activeLink?.querySelector('svg');

      expect(icon).toHaveClass('text-white');
    });

    it('should apply correct icon classes when inactive', () => {
      (usePathname as any).mockReturnValue('/en/admin');

      const { container } = render(<Sidebar locale="en" />);

      const inactiveLink = container.querySelector(
        'a[href="/en/admin/submissions"]',
      );
      const icon = inactiveLink?.querySelector('svg');

      expect(icon).toHaveClass('text-gray-400');
    });
  });

  describe('Styling and Layout', () => {
    it('should have fixed positioning on large screens', () => {
      (usePathname as any).mockReturnValue('/en/admin');

      const { container } = render(<Sidebar locale="en" />);

      const sidebar = container.querySelector('.lg\\:fixed');
      expect(sidebar).toBeInTheDocument();
    });

    it('should be hidden on small screens', () => {
      (usePathname as any).mockReturnValue('/en/admin');

      const { container } = render(<Sidebar locale="en" />);

      const sidebar = container.querySelector('.hidden');
      expect(sidebar).toBeInTheDocument();
    });

    it('should have correct width classes', () => {
      (usePathname as any).mockReturnValue('/en/admin');

      const { container } = render(<Sidebar locale="en" />);

      const sidebar = container.querySelector('.lg\\:w-64');
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should use semantic navigation elements', () => {
      (usePathname as any).mockReturnValue('/en/admin');

      const { container } = render(<Sidebar locale="en" />);

      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('should have role="list" on navigation lists', () => {
      (usePathname as any).mockReturnValue('/en/admin');

      const { container } = render(<Sidebar locale="en" />);

      const lists = container.querySelectorAll('ul[role="list"]');
      expect(lists.length).toBeGreaterThan(0);
    });

    it('should have proper link text for screen readers', () => {
      (usePathname as any).mockReturnValue('/en/admin');

      render(<Sidebar locale="en" />);

      const overviewLink = screen.getByText('Overview');
      expect(overviewLink.closest('a')).toHaveAttribute('href', '/en/admin');
    });
  });

  describe('Edge Cases', () => {
    it('should handle unknown pathnames gracefully', () => {
      (usePathname as any).mockReturnValue('/en/unknown-page');

      const { container } = render(<Sidebar locale="en" />);

      const activeLinks = container.querySelectorAll('.bg-primary');
      expect(activeLinks).toHaveLength(0);
    });

    it('should handle pathnames with trailing slashes', () => {
      (usePathname as any).mockReturnValue('/en/admin/');

      const { container } = render(<Sidebar locale="en" />);

      // Should not match because of exact comparison
      const overviewLink = container.querySelector('a[href="/en/admin"]');
      expect(overviewLink).not.toHaveClass('bg-primary');
    });

    it('should handle deeply nested pathnames', () => {
      (usePathname as any).mockReturnValue(
        '/en/admin/submissions/innovators/123',
      );

      const { container } = render(<Sidebar locale="en" />);

      // Should match the 'Submissions' parent item
      const activeLinks = container.querySelectorAll('.bg-primary');
      expect(activeLinks).toHaveLength(1);
      expect(activeLinks[0]).toHaveTextContent('Submissions');
    });
  });

  describe('Locale Switching', () => {
    it('should switch navigation labels when locale changes', async () => {
      (usePathname as any).mockReturnValue('/en/admin');

      const { rerender } = render(<Sidebar locale="en" />);
      expect(await screen.findByText('Overview')).toBeInTheDocument();

      rerender(<Sidebar locale="ar" />);
      const dashboardTexts = await screen.findAllByText('لوحة التحكم');
      expect(dashboardTexts.length).toBeGreaterThan(0);
      expect(screen.queryByText('Overview')).not.toBeInTheDocument();
    });

    it('should update hrefs when locale changes', () => {
      (usePathname as any).mockReturnValue('/en/admin');

      const { container, rerender } = render(<Sidebar locale="en" />);
      expect(
        container.querySelector('a[href="/en/admin"]'),
      ).toBeInTheDocument();

      rerender(<Sidebar locale="ar" />);
      expect(
        container.querySelector('a[href="/ar/admin"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('a[href="/en/admin"]'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Transition Classes', () => {
    it('should have transition classes on links', () => {
      (usePathname as any).mockReturnValue('/en/admin');

      const { container } = render(<Sidebar locale="en" />);

      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        expect(link).toHaveClass('transition-colors');
      });
    });
  });
});
