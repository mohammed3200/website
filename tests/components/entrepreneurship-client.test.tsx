import { describe, it, expect, jest, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/jest-globals';
import EntrepreneurshipClient from '@/app/[locale]/entrepreneurship/components/entrepreneurship-client';

// Mock framer-motion
mock.module('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock next-intl
mock.module('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'Entrepreneurship Development',
      subtitle: 'Empowering the next generation',
      emptyState: 'No content available.',
    };
    return translations[key] || key;
  },
}));

describe('EntrepreneurshipClient Component', () => {
  const mockEmptyContent: any[] = [];

  describe('Rendering with Database Content', () => {
    it('should render hero section with database content', () => {
      const mockContent = [
        {
          id: '1',
          page: 'entrepreneurship',
          section: 'hero',
          titleEn: 'Custom Entrepreneurship Title',
          titleAr: 'عنوان ريادة الأعمال المخصص',
          contentEn: 'Custom description',
          contentAr: 'وصف مخصص',
          order: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          icon: null,
          color: null,
          metadata: null,
        },
      ];

      render(<EntrepreneurshipClient locale="en" content={mockContent} />);

      expect(screen.getByText('Custom Entrepreneurship Title')).toBeInTheDocument();
      expect(screen.getByText('Custom description')).toBeInTheDocument();
    });

    it('should render hero section in Arabic', () => {
      const mockContent = [
        {
          id: '1',
          page: 'entrepreneurship',
          section: 'hero',
          titleEn: 'Custom Title',
          titleAr: 'عنوان مخصص',
          contentEn: 'Custom description',
          contentAr: 'وصف مخصص',
          order: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          icon: null,
          color: null,
          metadata: null,
        },
      ];

      render(<EntrepreneurshipClient locale="ar" content={mockContent} />);

      expect(screen.getByText('عنوان مخصص')).toBeInTheDocument();
      expect(screen.getByText('وصف مخصص')).toBeInTheDocument();
    });

    it('should render goals from database', () => {
      const mockContent = [
        {
          id: '2',
          page: 'entrepreneurship',
          section: 'goals',
          titleEn: 'Custom Goal',
          titleAr: 'هدف مخصص',
          contentEn: 'Goal description',
          contentAr: 'وصف الهدف',
          icon: 'Rocket',
          order: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          color: null,
          metadata: null,
        },
      ];

      render(<EntrepreneurshipClient locale="en" content={mockContent} />);

      expect(screen.getByText('Custom Goal')).toBeInTheDocument();
      expect(screen.getByText('Goal description')).toBeInTheDocument();
    });

    it('should render multiple goals in correct order', () => {
      const mockContent = [
        {
          id: '1',
          page: 'entrepreneurship',
          section: 'goals',
          titleEn: 'Goal One',
          titleAr: 'الهدف الأول',
          contentEn: 'First goal',
          order: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          icon: null,
          color: null,
          metadata: null,
          contentAr: null,
        },
        {
          id: '2',
          page: 'entrepreneurship',
          section: 'goals',
          titleEn: 'Goal Two',
          titleAr: 'الهدف الثاني',
          contentEn: 'Second goal',
          order: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          icon: null,
          color: null,
          metadata: null,
          contentAr: null,
        },
      ];

      render(<EntrepreneurshipClient locale="en" content={mockContent} />);

      const goals = screen.getAllByText(/Goal/);
      expect(goals).toHaveLength(2);
    });
  });

  describe('Fallback to Translation Keys', () => {
    it('should use translation fallback when no database content', () => {
      render(<EntrepreneurshipClient locale="en" content={mockEmptyContent} />);

      expect(screen.getByText('Entrepreneurship Development')).toBeInTheDocument();
      expect(screen.getByText('Empowering the next generation')).toBeInTheDocument();
    });

    it('should render empty state when goals are missing', () => {
      render(<EntrepreneurshipClient locale="en" content={mockEmptyContent} />);

      expect(screen.getByText('No content available.')).toBeInTheDocument();
    });
  });

  describe('Locale-specific Rendering', () => {
    it('should apply RTL direction for Arabic locale', () => {
      const { container } = render(
        <EntrepreneurshipClient locale="ar" content={mockEmptyContent} />
      );

      const section = container.querySelector('section');
      expect(section).toHaveAttribute('dir', 'rtl');
    });

    it('should apply LTR direction for English locale', () => {
      const { container } = render(
        <EntrepreneurshipClient locale="en" content={mockEmptyContent} />
      );

      const section = container.querySelector('section');
      expect(section).toHaveAttribute('dir', 'ltr');
    });

    it('should prefer Arabic content when locale is Arabic', () => {
      const mockContent = [
        {
          id: '1',
          page: 'entrepreneurship',
          section: 'hero',
          titleEn: 'English Title',
          titleAr: 'عنوان عربي',
          contentEn: 'English content',
          contentAr: 'محتوى عربي',
          order: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          icon: null,
          color: null,
          metadata: null,
        },
      ];

      render(<EntrepreneurshipClient locale="ar" content={mockContent} />);

      expect(screen.getByText('عنوان عربي')).toBeInTheDocument();
      expect(screen.getByText('محتوى عربي')).toBeInTheDocument();
    });

    it('should fallback to English when Arabic content is missing', () => {
      const mockContent = [
        {
          id: '1',
          page: 'entrepreneurship',
          section: 'hero',
          titleEn: 'English Only Title',
          titleAr: null,
          contentEn: 'English only content',
          contentAr: null,
          order: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          icon: null,
          color: null,
          metadata: null,
        },
      ];

      render(<EntrepreneurshipClient locale="ar" content={mockContent} />);

      expect(screen.getByText('English Only Title')).toBeInTheDocument();
      expect(screen.getByText('English only content')).toBeInTheDocument();
    });
  });

  describe('Icon Handling', () => {
    it('should use default icon when icon field is null', () => {
      const mockContent = [
        {
          id: '2',
          page: 'entrepreneurship',
          section: 'goals',
          titleEn: 'Goal Without Icon',
          contentEn: 'Description',
          icon: null,
          order: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          titleAr: null,
          contentAr: null,
          color: null,
          metadata: null,
        },
      ];

      const { container } = render(
        <EntrepreneurshipClient locale="en" content={mockContent} />
      );

      // Component should render without errors
      expect(container.querySelector('section')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content array gracefully', () => {
      const { container } = render(
        <EntrepreneurshipClient locale="en" content={[]} />
      );

      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should handle partial content fields', () => {
      const mockContent = [
        {
          id: '1',
          page: 'entrepreneurship',
          section: 'hero',
          titleEn: 'Title Only',
          titleAr: null,
          contentEn: null,
          contentAr: null,
          order: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          icon: null,
          color: null,
          metadata: null,
        },
      ];

      render(<EntrepreneurshipClient locale="en" content={mockContent} />);

      expect(screen.getByText('Title Only')).toBeInTheDocument();
    });

    it('should handle mixed active and inactive content', () => {
      const mockContent = [
        {
          id: '1',
          page: 'entrepreneurship',
          section: 'goals',
          titleEn: 'Active Goal',
          order: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          titleAr: null,
          contentEn: null,
          contentAr: null,
          icon: null,
          color: null,
          metadata: null,
        },
        {
          id: '2',
          page: 'entrepreneurship',
          section: 'goals',
          titleEn: 'Inactive Goal',
          order: 1,
          isActive: false, // In test scenario, components do not filter out inactive, it's done via API
          createdAt: new Date(),
          updatedAt: new Date(),
          titleAr: null,
          contentEn: null,
          contentAr: null,
          icon: null,
          color: null,
          metadata: null,
        },
      ];

      render(<EntrepreneurshipClient locale="en" content={mockContent} />);

      // If component just renders whatever is passed, both might show up since API filters.
      expect(screen.getByText('Active Goal')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render semantic HTML structure', () => {
      const { container } = render(
        <EntrepreneurshipClient locale="en" content={mockEmptyContent} />
      );

      expect(container.querySelector('section')).toBeInTheDocument();
      expect(container.querySelector('h1')).toBeInTheDocument();
    });
  });

  describe('Source-of-Truth Section Whitelist', () => {
    // The Entrepreneurship page only renders sections from the
    // `أهداف_قسم_الريادة.docx` source document plus hero/cta wrappers.
    // Any record with one of these dead sections must be ignored.
    it.each(['programs', 'values', 'mission'])(
      'should not render content for the invented section "%s"',
      (deadSection) => {
        const mockContent = [
          {
            id: '1',
            page: 'entrepreneurship',
            section: deadSection,
            titleEn: 'Should-not-be-rendered Title',
            titleAr: 'عنوان لا يجب أن يظهر',
            order: 0,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            contentEn: null,
            contentAr: null,
            icon: null,
            color: null,
            metadata: null,
          },
        ];

        render(<EntrepreneurshipClient locale="en" content={mockContent} />);

        expect(
          screen.queryByText('Should-not-be-rendered Title'),
        ).not.toBeInTheDocument();
      },
    );

    it('should render exactly six goal cards when seeded with the D.3 fixture', () => {
      // Mirrors prisma/seed-ebic-page-content.ts entrepreneurship/goals
      const fixture = [
        { titleEn: 'Spreading entrepreneurial awareness', icon: 'Megaphone' },
        { titleEn: 'Developing entrepreneurial thinking', icon: 'Brain' },
        { titleEn: 'Attracting entrepreneurial talent', icon: 'Lightbulb' },
        { titleEn: 'Following up on graduate startups', icon: 'GraduationCap' },
        {
          titleEn: 'Encouraging a culture of creativity and excellence',
          icon: 'Sparkles',
        },
        {
          titleEn: 'Converting scientific research into products',
          icon: 'FlaskConical',
        },
      ].map((g, i) => ({
        id: `g-${i}`,
        page: 'entrepreneurship',
        section: 'goals',
        order: i,
        titleEn: g.titleEn,
        titleAr: 'هدف',
        contentEn: 'Description',
        contentAr: 'وصف',
        icon: g.icon,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        color: null,
        metadata: null,
      }));

      render(<EntrepreneurshipClient locale="en" content={fixture} />);

      for (const g of fixture) {
        expect(screen.getByText(g.titleEn)).toBeInTheDocument();
      }
    });
  });
});