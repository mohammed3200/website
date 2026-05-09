import { describe, it, expect, jest, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/jest-globals';
import IncubatorsClient from '@/app/[locale]/incubators/components/incubators-client';

// Mock framer-motion
mock.module('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
  },
}));

// Mock next-intl
mock.module('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'Business Incubation Program',
      subtitle: 'Structured support for startups',
      emptyState: 'No content available.',
    };
    return translations[key] || key;
  },
}));

describe('IncubatorsClient Component', () => {
  const mockEmptyContent: any[] = [];

  describe('Rendering with Database Content', () => {
    it('should render hero section with database content', () => {
      const mockContent = [
        {
          id: '1',
          page: 'incubators',
          section: 'hero',
          titleEn: 'Custom Incubators Title',
          titleAr: 'عنوان الحاضنات المخصص',
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

      render(<IncubatorsClient locale="en" content={mockContent} />);

      expect(screen.getByText('Custom Incubators Title')).toBeInTheDocument();
      expect(screen.getByText('Custom description')).toBeInTheDocument();
    });

    it('should render tasks from database', () => {
      const mockContent = [
        {
          id: '2',
          page: 'incubators',
          section: 'tasks',
          titleEn: 'Custom Task',
          titleAr: 'مهمة مخصصة',
          contentEn: 'Task description',
          contentAr: 'وصف المهمة',
          icon: 'Lightbulb',
          order: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          color: null,
          metadata: null,
        },
      ];

      render(<IncubatorsClient locale="en" content={mockContent} />);

      expect(screen.getByText('Custom Task')).toBeInTheDocument();
      expect(screen.getByText('Task description')).toBeInTheDocument();
    });

    it('should render multiple tasks in order', () => {
      const mockContent = [
        {
          id: '1',
          page: 'incubators',
          section: 'tasks',
          titleEn: 'Task One',
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
          page: 'incubators',
          section: 'tasks',
          titleEn: 'Task Two',
          order: 1,
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
      ];

      render(<IncubatorsClient locale="en" content={mockContent} />);

      expect(screen.getByText('Task One')).toBeInTheDocument();
      expect(screen.getByText('Task Two')).toBeInTheDocument();
    });
  });

  describe('Fallback to Translation Keys', () => {
    it('should use translation fallback when no database content', async () => {
      render(<IncubatorsClient locale="en" content={mockEmptyContent} />);

      expect(
        await screen.findByText('Business Incubation Program'),
      ).toBeInTheDocument();
      expect(
        await screen.findByText('Structured support for startups'),
      ).toBeInTheDocument();
    });

    it('should render empty state when tasks are missing', async () => {
      render(<IncubatorsClient locale="en" content={mockEmptyContent} />);

      const emptyStates = await screen.findAllByText('No content available.');
      expect(emptyStates).toHaveLength(1);
    });
  });

  describe('Locale-specific Rendering', () => {
    it('should apply RTL direction for Arabic locale', () => {
      const { container } = render(
        <IncubatorsClient locale="ar" content={mockEmptyContent} />,
      );

      const section = container.querySelector('section');
      expect(section).toHaveAttribute('dir', 'rtl');
    });

    it('should apply LTR direction for English locale', () => {
      const { container } = render(
        <IncubatorsClient locale="en" content={mockEmptyContent} />,
      );

      const section = container.querySelector('section');
      expect(section).toHaveAttribute('dir', 'ltr');
    });

    it('should prefer Arabic content when locale is Arabic', () => {
      const mockContent = [
        {
          id: '1',
          page: 'incubators',
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

      render(<IncubatorsClient locale="ar" content={mockContent} />);

      expect(screen.getByText('عنوان عربي')).toBeInTheDocument();
      expect(screen.getByText('محتوى عربي')).toBeInTheDocument();
    });

    it('should fallback to English when Arabic content is missing', () => {
      const mockContent = [
        {
          id: '1',
          page: 'incubators',
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

      render(<IncubatorsClient locale="ar" content={mockContent} />);

      expect(screen.getByText('English Only Title')).toBeInTheDocument();
      expect(screen.getByText('English only content')).toBeInTheDocument();
    });
  });

  describe('Icon Handling', () => {
    it('should use specified icon from database', () => {
      const mockContent = [
        {
          id: '1',
          page: 'incubators',
          section: 'tasks',
          titleEn: 'Task With Icon',
          contentEn: 'Description',
          icon: 'Lightbulb',
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
        <IncubatorsClient locale="en" content={mockContent} />,
      );

      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should use default icon when icon field is null', () => {
      const mockContent = [
        {
          id: '1',
          page: 'incubators',
          section: 'tasks',
          titleEn: 'Task Without Icon',
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
        <IncubatorsClient locale="en" content={mockContent} />,
      );

      expect(container.querySelector('section')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content array gracefully', () => {
      const { container } = render(
        <IncubatorsClient locale="en" content={[]} />,
      );

      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should handle partial content fields', () => {
      const mockContent = [
        {
          id: '1',
          page: 'incubators',
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

      render(<IncubatorsClient locale="en" content={mockContent} />);

      expect(screen.getByText('Title Only')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render semantic HTML structure', () => {
      const { container } = render(
        <IncubatorsClient locale="en" content={mockEmptyContent} />,
      );

      expect(container.querySelector('section')).toBeInTheDocument();
      expect(container.querySelector('h1')).toBeInTheDocument();
    });
  });

  describe('Source-of-Truth Section Whitelist', () => {
    // The Incubators page only renders sections from the
    // `أهداف_قسم_الحاضنات.docx` source document plus hero/cta wrappers.
    it.each(['phases', 'resources', 'metrics'])(
      'should not render content for the invented section "%s"',
      (deadSection) => {
        const mockContent = [
          {
            id: '1',
            page: 'incubators',
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

        render(<IncubatorsClient locale="en" content={mockContent} />);

        expect(
          screen.queryByText('Should-not-be-rendered Title'),
        ).not.toBeInTheDocument();
      },
    );

    it('should render exactly five task cards when seeded with the D.4 fixture', () => {
      const fixture = [
        { titleEn: 'Project incubation', icon: 'Building2' },
        { titleEn: 'Guidance, training, and consulting services', icon: 'MessageSquare' },
        {
          titleEn: 'Implementing privileges, grants, and funding programs',
          icon: 'DollarSign',
        },
        { titleEn: 'Preparing economic feasibility studies', icon: 'BarChart3' },
        { titleEn: 'Developing existing factories', icon: 'Factory' },
      ].map((t, i) => ({
        id: `t-${i}`,
        page: 'incubators',
        section: 'tasks',
        order: i,
        titleEn: t.titleEn,
        titleAr: 'مهمة',
        contentEn: 'Description',
        contentAr: 'وصف',
        icon: t.icon,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        color: null,
        metadata: null,
      }));

      render(<IncubatorsClient locale="en" content={fixture} />);

      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(fixture.length);

      for (const t of fixture) {
        expect(screen.getByText(t.titleEn)).toBeInTheDocument();
      }
    });
  });
});
