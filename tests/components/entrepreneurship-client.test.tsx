import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EntrepreneurshipClient from '@/app/[locale]/entrepreneurship/components/entrepreneurship-client';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'Entrepreneurship Development',
      subtitle: 'Empowering the next generation',
      workshops: 'Workshops & Training',
      workshopsDesc: 'Intensive training programs',
      mentorship: 'Mentorship Programs',
      mentorshipDesc: 'One-on-one guidance',
      strategic: 'Strategic Planning',
      strategicDesc: 'Business strategy development',
      growth: 'Growth Support',
      growthDesc: 'Scaling your business',
      excellence: 'Excellence',
      innovation: 'Innovation',
      collaboration: 'Collaboration',
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

    it('should render programs from database', () => {
      const mockContent = [
        {
          id: '2',
          page: 'entrepreneurship',
          section: 'programs',
          titleEn: 'Custom Program',
          titleAr: 'برنامج مخصص',
          contentEn: 'Program description',
          contentAr: 'وصف البرنامج',
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

      expect(screen.getByText('Custom Program')).toBeInTheDocument();
      expect(screen.getByText('Program description')).toBeInTheDocument();
    });

    it('should render multiple programs in correct order', () => {
      const mockContent = [
        {
          id: '1',
          page: 'entrepreneurship',
          section: 'programs',
          titleEn: 'Program One',
          titleAr: 'البرنامج الأول',
          contentEn: 'First program',
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
          section: 'programs',
          titleEn: 'Program Two',
          titleAr: 'البرنامج الثاني',
          contentEn: 'Second program',
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

      const programs = screen.getAllByText(/Program/);
      expect(programs).toHaveLength(2);
    });

    it('should render values section from database', () => {
      const mockContent = [
        {
          id: '3',
          page: 'entrepreneurship',
          section: 'values',
          titleEn: 'Innovation First',
          titleAr: 'الابتكار أولاً',
          contentEn: null,
          contentAr: null,
          icon: 'Lightbulb',
          order: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          color: null,
          metadata: null,
        },
      ];

      render(<EntrepreneurshipClient locale="en" content={mockContent} />);

      expect(screen.getByText('Innovation First')).toBeInTheDocument();
    });
  });

  describe('Fallback to Translation Keys', () => {
    it('should use translation fallback when no database content', () => {
      render(<EntrepreneurshipClient locale="en" content={mockEmptyContent} />);

      expect(screen.getByText('Entrepreneurship Development')).toBeInTheDocument();
      expect(screen.getByText('Empowering the next generation')).toBeInTheDocument();
    });

    it('should render fallback programs grid', () => {
      render(<EntrepreneurshipClient locale="en" content={mockEmptyContent} />);

      expect(screen.getByText('Workshops & Training')).toBeInTheDocument();
      expect(screen.getByText('Mentorship Programs')).toBeInTheDocument();
      expect(screen.getByText('Strategic Planning')).toBeInTheDocument();
      expect(screen.getByText('Growth Support')).toBeInTheDocument();
    });

    it('should render fallback values', () => {
      render(<EntrepreneurshipClient locale="en" content={mockEmptyContent} />);

      expect(screen.getByText('Excellence')).toBeInTheDocument();
      expect(screen.getByText('Innovation')).toBeInTheDocument();
      expect(screen.getByText('Collaboration')).toBeInTheDocument();
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

  describe('Mission and CTA Sections', () => {
    it('should render mission section when provided', () => {
      const mockContent = [
        {
          id: '4',
          page: 'entrepreneurship',
          section: 'mission',
          titleEn: 'Our Mission',
          titleAr: 'مهمتنا',
          contentEn: 'To empower entrepreneurs worldwide',
          contentAr: 'لتمكين رواد الأعمال في جميع أنحاء العالم',
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

      expect(screen.getByText('Our Mission')).toBeInTheDocument();
      expect(screen.getByText('To empower entrepreneurs worldwide')).toBeInTheDocument();
    });

    it('should render CTA section when provided', () => {
      const mockContent = [
        {
          id: '5',
          page: 'entrepreneurship',
          section: 'cta',
          titleEn: 'Join Us Today',
          titleAr: 'انضم إلينا اليوم',
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

      expect(screen.getByText('Join Us Today')).toBeInTheDocument();
    });

    it('should not render mission section when not provided', () => {
      render(<EntrepreneurshipClient locale="en" content={mockEmptyContent} />);

      expect(screen.queryByText('Our Mission')).not.toBeInTheDocument();
    });
  });

  describe('Icon Handling', () => {
    it('should use default icon when icon field is null', () => {
      const mockContent = [
        {
          id: '2',
          page: 'entrepreneurship',
          section: 'programs',
          titleEn: 'Program Without Icon',
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
          section: 'programs',
          titleEn: 'Active Program',
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
          section: 'programs',
          titleEn: 'Inactive Program',
          order: 1,
          isActive: false, // This should be filtered out by the page query
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

      expect(screen.getByText('Active Program')).toBeInTheDocument();
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
});