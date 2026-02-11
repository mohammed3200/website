import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import IncubatorsClient from '@/app/[locale]/incubators/components/incubators-client';

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
      title: 'Business Incubation Program',
      subtitle: 'Structured support for startups',
      ideation: 'Ideation Phase',
      ideationDesc: 'Refining your concept',
      development: 'Development Phase',
      developmentDesc: 'Building your MVP',
      scaling: 'Scaling Phase',
      scalingDesc: 'Growing your business',
      mentorship: 'Expert Mentorship',
      mentorshipDesc: 'One-on-one guidance',
      workspace: 'Co-working Space',
      workspaceDesc: 'Professional workspace',
      funding: 'Funding Access',
      fundingDesc: 'Investment opportunities',
      networking: 'Networking Events',
      networkingDesc: 'Connect with investors',
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

    it('should render phases from database', () => {
      const mockContent = [
        {
          id: '2',
          page: 'incubators',
          section: 'phases',
          titleEn: 'Custom Phase',
          titleAr: 'مرحلة مخصصة',
          contentEn: 'Phase description',
          contentAr: 'وصف المرحلة',
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

      expect(screen.getByText('Custom Phase')).toBeInTheDocument();
      expect(screen.getByText('Phase description')).toBeInTheDocument();
    });

    it('should render resources from database', () => {
      const mockContent = [
        {
          id: '3',
          page: 'incubators',
          section: 'resources',
          titleEn: 'Custom Resource',
          titleAr: 'مورد مخصص',
          contentEn: 'Resource description',
          contentAr: 'وصف المورد',
          icon: 'Users',
          order: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          color: null,
          metadata: null,
        },
      ];

      render(<IncubatorsClient locale="en" content={mockContent} />);

      expect(screen.getByText('Custom Resource')).toBeInTheDocument();
      expect(screen.getByText('Resource description')).toBeInTheDocument();
    });

    it('should render metrics section with numbers', () => {
      const mockContent = [
        {
          id: '4',
          page: 'incubators',
          section: 'metrics',
          titleEn: 'Startups Supported',
          titleAr: 'شركات مدعومة',
          contentEn: null,
          contentAr: null,
          order: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          icon: null,
          color: null,
          metadata: { number: 150 },
        },
        {
          id: '5',
          page: 'incubators',
          section: 'metrics',
          titleEn: 'Jobs Created',
          titleAr: 'وظائف مُنشأة',
          contentEn: null,
          contentAr: null,
          order: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          icon: null,
          color: null,
          metadata: { number: 450 },
        },
      ];

      render(<IncubatorsClient locale="en" content={mockContent} />);

      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('450')).toBeInTheDocument();
      expect(screen.getByText('Startups Supported')).toBeInTheDocument();
      expect(screen.getByText('Jobs Created')).toBeInTheDocument();
    });
  });

  describe('Fallback to Translation Keys', () => {
    it('should use translation fallback when no database content', () => {
      render(<IncubatorsClient locale="en" content={mockEmptyContent} />);

      expect(screen.getByText('Business Incubation Program')).toBeInTheDocument();
      expect(screen.getByText('Structured support for startups')).toBeInTheDocument();
    });

    it('should render fallback phases', () => {
      render(<IncubatorsClient locale="en" content={mockEmptyContent} />);

      expect(screen.getByText('Ideation Phase')).toBeInTheDocument();
      expect(screen.getByText('Development Phase')).toBeInTheDocument();
      expect(screen.getByText('Scaling Phase')).toBeInTheDocument();
    });

    it('should render fallback resources', () => {
      render(<IncubatorsClient locale="en" content={mockEmptyContent} />);

      expect(screen.getByText('Expert Mentorship')).toBeInTheDocument();
      expect(screen.getByText('Co-working Space')).toBeInTheDocument();
      expect(screen.getByText('Funding Access')).toBeInTheDocument();
      expect(screen.getByText('Networking Events')).toBeInTheDocument();
    });
  });

  describe('Locale-specific Rendering', () => {
    it('should apply RTL direction for Arabic locale', () => {
      const { container } = render(
        <IncubatorsClient locale="ar" content={mockEmptyContent} />
      );

      const section = container.querySelector('section');
      expect(section).toHaveAttribute('dir', 'rtl');
    });

    it('should apply LTR direction for English locale', () => {
      const { container } = render(
        <IncubatorsClient locale="en" content={mockEmptyContent} />
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

  describe('CTA Section', () => {
    it('should render CTA section when provided', () => {
      const mockContent = [
        {
          id: '6',
          page: 'incubators',
          section: 'cta',
          titleEn: 'Apply Now',
          titleAr: 'قدم الآن',
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

      expect(screen.getByText('Apply Now')).toBeInTheDocument();
    });
  });

  describe('Metadata Handling', () => {
    it('should handle metrics with number metadata', () => {
      const mockContent = [
        {
          id: '1',
          page: 'incubators',
          section: 'metrics',
          titleEn: 'Success Rate',
          titleAr: 'معدل النجاح',
          order: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          contentEn: null,
          contentAr: null,
          icon: null,
          color: null,
          metadata: { number: 95 },
        },
      ];

      render(<IncubatorsClient locale="en" content={mockContent} />);

      expect(screen.getByText('95')).toBeInTheDocument();
      expect(screen.getByText('Success Rate')).toBeInTheDocument();
    });

    it('should handle missing metadata gracefully', () => {
      const mockContent = [
        {
          id: '1',
          page: 'incubators',
          section: 'metrics',
          titleEn: 'Metric Without Number',
          titleAr: null,
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

      expect(screen.getByText('0')).toBeInTheDocument(); // Default fallback
      expect(screen.getByText('Metric Without Number')).toBeInTheDocument();
    });

    it('should handle string number in metadata', () => {
      const mockContent = [
        {
          id: '1',
          page: 'incubators',
          section: 'metrics',
          titleEn: 'String Number',
          order: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          titleAr: null,
          contentEn: null,
          contentAr: null,
          icon: null,
          color: null,
          metadata: { number: '200' },
        },
      ];

      render(<IncubatorsClient locale="en" content={mockContent} />);

      expect(screen.getByText('200')).toBeInTheDocument();
    });
  });

  describe('Icon Handling', () => {
    it('should use specified icon from database', () => {
      const mockContent = [
        {
          id: '1',
          page: 'incubators',
          section: 'phases',
          titleEn: 'Phase With Icon',
          contentEn: 'Description',
          icon: 'Rocket',
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
        <IncubatorsClient locale="en" content={mockContent} />
      );

      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should use default icon when icon field is null', () => {
      const mockContent = [
        {
          id: '1',
          page: 'incubators',
          section: 'phases',
          titleEn: 'Phase Without Icon',
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
        <IncubatorsClient locale="en" content={mockContent} />
      );

      expect(container.querySelector('section')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content array gracefully', () => {
      const { container } = render(
        <IncubatorsClient locale="en" content={[]} />
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

    it('should handle multiple phases in order', () => {
      const mockContent = [
        {
          id: '1',
          page: 'incubators',
          section: 'phases',
          titleEn: 'Phase One',
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
          section: 'phases',
          titleEn: 'Phase Two',
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

      expect(screen.getByText('Phase One')).toBeInTheDocument();
      expect(screen.getByText('Phase Two')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render semantic HTML structure', () => {
      const { container } = render(
        <IncubatorsClient locale="en" content={mockEmptyContent} />
      );

      expect(container.querySelector('section')).toBeInTheDocument();
      expect(container.querySelector('h1')).toBeInTheDocument();
    });
  });

  describe('Content Filtering by Section', () => {
    it('should correctly separate phases and resources', () => {
      const mockContent = [
        {
          id: '1',
          page: 'incubators',
          section: 'phases',
          titleEn: 'A Phase',
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
          section: 'resources',
          titleEn: 'A Resource',
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
      ];

      render(<IncubatorsClient locale="en" content={mockContent} />);

      expect(screen.getByText('A Phase')).toBeInTheDocument();
      expect(screen.getByText('A Resource')).toBeInTheDocument();
    });
  });
});