import { Hono } from 'hono';
import collaboratorApp from '@/features/collaborators/server/route';
import { db } from '@/lib/db';
import { s3Service } from '@/lib/storage/s3-service';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    collaborator: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(db)),
    image: {
      create: jest.fn().mockResolvedValue({ id: 'image-1' }),
    },
    media: {
      create: jest.fn(),
    },
    experienceProvidedMedia: {
      create: jest.fn(),
    },
    machineryAndEquipmentMedia: {
      create: jest.fn(),
    },
    user: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  },
}));

jest.mock('@react-email/render', () => ({
  render: jest.fn().mockResolvedValue('<html>mock email</html>'),
}));

jest.mock('@/lib/email/email-service', () => ({
  emailService: {
    sendEmail: jest.fn().mockResolvedValue({ success: true }),
  },
}));

jest.mock('@/lib/notifications/admin-notifications', () => ({
  notifyNewCollaborator: jest.fn().mockResolvedValue(true),
  notifyNewInnovator: jest.fn().mockResolvedValue(true),
}));

jest.mock('@/auth', () => ({
  auth: jest.fn().mockResolvedValue({ user: { id: 'admin-id' } }),
}));

jest.mock('@/lib/storage/s3-service', () => ({
  s3Service: {
    uploadFile: jest.fn().mockResolvedValue({
      url: 'https://s3.example.com/file.png',
      key: 'file.png',
      bucket: 'bucket',
    }),
    deleteFile: jest.fn().mockResolvedValue(true),
    generateKey: jest.fn((prefix, filename, uuid) => `${prefix}/${uuid}-${filename}`),
  },
}));

// Mount app for testing routes
const app = new Hono();
app.route('/api/collaborator', collaboratorApp);

describe('Collaborator API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/collaborator', () => {
    it('should create a collaborator on valid data', async () => {
      // Setup mock returns
      (db.collaborator.findFirst as jest.Mock).mockResolvedValue(null);
      (db.collaborator.create as jest.Mock).mockResolvedValue({
        id: 'collab-1',
        email: 'test@example.com',
      });

      const formData = new FormData();
      formData.append('companyName', 'Test Company');
      formData.append('email', 'test@example.com');
      formData.append('primaryPhoneNumber', '+1234567890');
      formData.append('industrialSector', 'Technology');
      formData.append('specialization', 'Software');
      formData.append('TermsOfUse', 'true'); // boolean comes through FormData as string 'true' or mapped. FormController handles this. Actually, Zod server schema validates it.

      const res = await app.request('/api/collaborator', {
        method: 'POST',
        body: formData,
      });

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.message).toBeDefined();
      expect(db.collaborator.create).toHaveBeenCalled();
    });

    it('should return 400 if email already exists', async () => {
      (db.collaborator.findFirst as jest.Mock).mockResolvedValue({
        id: 'existing-1',
        email: 'test@example.com',
      });

      const formData = new FormData();
      formData.append('companyName', 'Test Company');
      formData.append('email', 'test@example.com');
      formData.append('primaryPhoneNumber', '+1234567890');
      formData.append('industrialSector', 'Technology');
      formData.append('specialization', 'Software');

      const res = await app.request('/api/collaborator', {
        method: 'POST',
        body: formData,
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.code).toBe('EMAIL_EXISTS');
    });

    it('should handle file uploads correctly', async () => {
      (db.collaborator.findFirst as jest.Mock).mockResolvedValue(null);
      (db.collaborator.create as jest.Mock).mockResolvedValue({ id: 'collab-1' });

      const formData = new FormData();
      formData.append('companyName', 'Test Company');
      formData.append('email', 'test@example.com');
      formData.append('primaryPhoneNumber', '+1234567890');
      formData.append('industrialSector', 'Technology');
      formData.append('specialization', 'Software');
      
      const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
      formData.append('image', file);

      const res = await app.request('/api/collaborator', {
        method: 'POST',
        body: formData,
      });

      expect(res.status).toBe(201);
      expect(s3Service.uploadFile).toHaveBeenCalled();
    });

    it('should return validation error for missing fields', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      // missing companyName, primaryPhoneNumber, etc.

      const res = await app.request('/api/collaborator', {
        method: 'POST',
        body: formData,
      });

      // Zod Validator from Hono responds with 400
      expect(res.status).toBe(400);
    });
  });

});
