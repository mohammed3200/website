import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  completeCollaboratorRegistrationSchemaServer,
} from '@/features/collaborators/schemas/step-schemas';
import { ListOfIndustrialSectors } from '@/features/collaborators/types/types';

const t = (key: string) => key;

describe('Collaborator Step Schemas', () => {
  describe('step1Schema (Company Info)', () => {
    const schema = step1Schema(t);

    it('should validate valid data', () => {
      const result = schema.safeParse({
        companyName: 'Acme Corp',
        primaryPhoneNumber: '+1234567890',
        email: 'test@acme.com',
      });
      expect(result.success).toBe(true);
    });

    it('should fail when required fields are missing', () => {
      const result = schema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues.some((i) => i.path.includes('companyName'))).toBe(true);
        expect(issues.some((i) => i.path.includes('primaryPhoneNumber'))).toBe(true);
        expect(issues.some((i) => i.path.includes('email'))).toBe(true);
      }
    });

    it('should validate email format', () => {
      expect(
        schema.safeParse({
          companyName: 'Acme',
          primaryPhoneNumber: '+1234567890',
          email: 'invalid-email',
        }).success,
      ).toBe(false);
    });

    it('should validate primary phone number format', () => {
      expect(
        schema.safeParse({
          companyName: 'Acme',
          primaryPhoneNumber: '12345', // missing plus and too short
          email: 'test@acme.com',
        }).success,
      ).toBe(false);
    });

    it('should validate optional URL site', () => {
      const baseData = {
        companyName: 'Acme',
        primaryPhoneNumber: '+1234567890',
        email: 'test@acme.com',
      };
      
      expect(schema.safeParse({ ...baseData, site: 'https://acme.com' }).success).toBe(true);
      expect(schema.safeParse({ ...baseData, site: 'not-a-url' }).success).toBe(false);
    });

    it('should accept valid optional phone number', () => {
      const result = schema.safeParse({
        companyName: 'Acme',
        primaryPhoneNumber: '+1234567890',
        email: 'test@acme.com',
        optionalPhoneNumber: '+0987654321',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('step2Schema (Industry Info)', () => {
    const schema = step2Schema(t);

    it('should validate valid data', () => {
      const result = schema.safeParse({
        industrialSector: ListOfIndustrialSectors.Technology,
        specialization: 'Software Development',
      });
      expect(result.success).toBe(true);
    });

    it('should fail with invalid enum value', () => {
      const result = schema.safeParse({
        industrialSector: 'Invalid Sector',
        specialization: 'Software Development',
      });
      expect(result.success).toBe(false);
    });

    it('should require specialization', () => {
      const result = schema.safeParse({
        industrialSector: ListOfIndustrialSectors.Technology,
        specialization: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('step3Schema (Capabilities)', () => {
    const schema = step3Schema(t);

    it('should validate empty input (all optional)', () => {
      const result = schema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should accept valid experience and machinery data', () => {
      const result = schema.safeParse({
        experienceProvided: '5 years of building web apps',
        machineryAndEquipment: 'Server farms',
      });
      expect(result.success).toBe(true);
    });

    // Note: File testing is complex in unit tests without a proper DOM environment setup,
    // but the schema's optional + default([]) covers array validation structurally.
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

  describe('serverSchema', () => {
    const schema = completeCollaboratorRegistrationSchemaServer;

    it('should validate complete valid submission', () => {
      const result = schema.safeParse({
        companyName: 'Acme Corp',
        primaryPhoneNumber: '+1234567890',
        email: 'test@acme.com',
        industrialSector: ListOfIndustrialSectors.Technology,
        specialization: 'Software',
      });
      expect(result.success).toBe(true);
    });

    it('should allow missing defaults on server context', () => {
      const result = schema.safeParse({
        companyName: 'Acme Corp',
        primaryPhoneNumber: '+1234567890',
        email: 'test@acme.com',
        industrialSector: ListOfIndustrialSectors.Technology,
        specialization: 'Software',
      });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.experienceProvidedMedia).toEqual([]);
        expect(result.data.machineryAndEquipmentMedia).toEqual([]);
      }
    });

    it('should fail when email is omitted', () => {
      const result = schema.safeParse({
        companyName: 'Acme Corp',
        primaryPhoneNumber: '+1234567890',
        industrialSector: ListOfIndustrialSectors.Technology,
        specialization: 'Software',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues.some((i) => i.path.includes('email'))).toBe(true);
      }
    });

    it('should fail if email is provided but invalid', () => {
      const result = schema.safeParse({
        companyName: 'Acme Corp',
        primaryPhoneNumber: '+1234567890',
        email: 'not-an-email',
        industrialSector: ListOfIndustrialSectors.Technology,
        specialization: 'Software',
      });
      expect(result.success).toBe(false);
    });
  });
});
