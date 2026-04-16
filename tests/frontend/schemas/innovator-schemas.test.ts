import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  innovatorServerSchema,
} from '@/features/innovators/schemas/step-schemas';
import { StageDevelopment } from '@/features/innovators/types/types';

const t = (key: string) => key;

describe('Innovator Step Schemas', () => {
  describe('step1Schema (Personal Info)', () => {
    const schema = step1Schema(t);

    it('should validate valid data', () => {
      const result = schema.safeParse({
        name: 'John Doe',
        phoneNumber: '+1234567890',
        email: 'john@example.com',
        country: 'USA',
        city: 'New York',
        specialization: 'Software Engineering',
      });
      expect(result.success).toBe(true);
    });

    it('should fail when required fields are missing', () => {
      const result = schema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues.some((i) => i.path.includes('name'))).toBe(true);
        expect(issues.some((i) => i.path.includes('phoneNumber'))).toBe(true);
        expect(issues.some((i) => i.path.includes('email'))).toBe(true);
        expect(issues.some((i) => i.path.includes('country'))).toBe(true);
        expect(issues.some((i) => i.path.includes('city'))).toBe(true);
        expect(issues.some((i) => i.path.includes('specialization'))).toBe(true);
      }
    });

    it('should validate max lengths for city and specialization', () => {
      const longString101 = 'a'.repeat(101);
      const longString201 = 'a'.repeat(201);
      
      const resultCity = schema.safeParse({
        name: 'John Doe',
        phoneNumber: '+1234567890',
        email: 'john@example.com',
        country: 'USA',
        city: longString101, // > 100
        specialization: 'Software',
      });
      expect(resultCity.success).toBe(false);

      const resultSpec = schema.safeParse({
        name: 'John Doe',
        phoneNumber: '+1234567890',
        email: 'john@example.com',
        country: 'USA',
        city: 'New York',
        specialization: longString201, // > 200
      });
      expect(resultSpec.success).toBe(false);
    });
  });

  describe('step2Schema (Project Overview)', () => {
    const schema = step2Schema(t);

    it('should validate valid project overview', () => {
      const result = schema.safeParse({
        projectTitle: 'AI Startup',
        projectDescription: 'Building AGI',
      });
      expect(result.success).toBe(true);
    });

    it('should allow optional objective', () => {
      const result = schema.safeParse({
        projectTitle: 'AI Startup',
        projectDescription: 'Building AGI',
        objective: 'Make money',
      });
      expect(result.success).toBe(true);
    });

    it('should limit projectDescription to 1000 characters', () => {
      const result = schema.safeParse({
        projectTitle: 'AI Startup',
        projectDescription: 'a'.repeat(1001),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('step3Schema (Project Stage & Files)', () => {
    const schema = step3Schema(t);

    it('should validate empty input (all optional)', () => {
      const result = schema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should validate valid StageDevelopment enum', () => {
      const result = schema.safeParse({
        stageDevelopment: StageDevelopment.PROTOTYPE,
      });
      expect(result.success).toBe(true);
    });

    it('should fail with invalid stage', () => {
      const result = schema.safeParse({
        stageDevelopment: 'INVALID_STAGE',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('step4Schema (Review)', () => {
    const schema = step4Schema(t);

    it('should validate when TermsOfUse is true', () => {
      const result = schema.safeParse({
        TermsOfUse: true,
      });
      expect(result.success).toBe(true);
    });

    it('should fail when TermsOfUse is false', () => {
      const result = schema.safeParse({
        TermsOfUse: false,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('innovatorServerSchema', () => {
    const schema = innovatorServerSchema;

    it('should validate complete valid submission', () => {
      const result = schema.safeParse({
        name: 'John',
        phoneNumber: '+1234567890',
        email: 'john@example.com',
        country: 'USA',
        city: 'NY',
        specialization: 'IT',
        projectTitle: 'Project A',
        projectDescription: 'Desc',
        stageDevelopment: StageDevelopment.TESTING,
        TermsOfUse: true,
      });
      expect(result.success).toBe(true);
    });

    it('should fail when email is omitted', () => {
      const result = schema.safeParse({
        name: 'John',
        phoneNumber: '+1234567890',
        country: 'USA',
        city: 'NY',
        specialization: 'IT',
        projectTitle: 'Project A',
        projectDescription: 'Desc',
        TermsOfUse: true,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('email'))).toBe(true);
      }
    });

    it('should fail if email is provided but invalid', () => {
      const result = schema.safeParse({
        name: 'John',
        phoneNumber: '+1234567890',
        email: 'not-an-email',
        country: 'USA',
        city: 'NY',
        specialization: 'IT',
        projectTitle: 'Project A',
        projectDescription: 'Desc',
        TermsOfUse: true,
      });
      expect(result.success).toBe(false);
    });
  });
});
