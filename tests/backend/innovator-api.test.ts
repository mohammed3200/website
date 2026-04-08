import { Hono } from 'hono';
import innovatorApp from '@/features/innovators/server/route';
import { db } from '@/lib/db';
import { s3Service } from '@/lib/storage/s3-service';
import { StageDevelopment } from '@/features/innovators/types/types';

jest.mock('@/lib/db', () => ({
  db: {
    innovator: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(db)),
    image: {
      create: jest.fn(),
    },
    media: {
      create: jest.fn(),
    },
    innovatorProjectFile: {
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
      url: 'https://s3.example.com/file.pdf',
      key: 'file.pdf',
      bucket: 'bucket',
    }),
    deleteFile: jest.fn().mockResolvedValue(true),
    generateKey: jest.fn((prefix, filename, uuid) => `${prefix}/${uuid}-${filename}`),
  },
}));

const app = new Hono();
app.route('/api/innovators', innovatorApp);

describe('Innovators API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/innovators', () => {
    it('should create an innovator successfully', async () => {
      (db.innovator.findFirst as jest.Mock).mockResolvedValue(null);
      (db.innovator.create as jest.Mock).mockResolvedValue({
        id: 'innovator-1',
      });

      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'john@example.com');
      formData.append('phoneNumber', '+1234567890');
      formData.append('country', 'USA');
      formData.append('city', 'New York');
      formData.append('specialization', 'AI');
      formData.append('projectTitle', 'AI Startup');
      formData.append('projectDescription', 'GenAI Platform');
      formData.append('stageDevelopment', StageDevelopment.PROTOTYPE);
      formData.append('TermsOfUse', 'true');

      const res = await app.request('/api/innovators', {
        method: 'POST',
        body: formData,
      });

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.message).toBeDefined();
      expect(db.innovator.create).toHaveBeenCalled();
    });

    it('should reject if email already exists', async () => {
      (db.innovator.findFirst as jest.Mock).mockResolvedValue({
        id: 'existing-1',
        email: 'john@example.com',
      });

      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'john@example.com');
      formData.append('phoneNumber', '+1234567890');
      formData.append('country', 'USA');
      formData.append('city', 'New York');
      formData.append('specialization', 'AI');
      formData.append('projectTitle', 'AI Startup');
      formData.append('projectDescription', 'GenAI Platform');
      formData.append('TermsOfUse', 'true');

      const res = await app.request('/api/innovators', {
        method: 'POST',
        body: formData,
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.code).toBe('EMAIL_EXISTS');
    });

    it('should accept project files and upload to S3', async () => {
      (db.innovator.findFirst as jest.Mock).mockResolvedValue(null);
      (db.innovator.create as jest.Mock).mockResolvedValue({ id: 'inno-1' });
      (db.media.create as jest.Mock).mockResolvedValue({ id: 'media-1' });

      const formData = new FormData();
      formData.append('name', 'John');
      formData.append('email', 'john@example.com');
      formData.append('phoneNumber', '+1234567890');
      formData.append('country', 'USA');
      formData.append('city', 'New York');
      formData.append('specialization', 'AI');
      formData.append('projectTitle', 'Project');
      formData.append('projectDescription', 'Desc');
      formData.append('TermsOfUse', 'true');

      const file = new File(['dummy content'], 'spec.pdf', { type: 'application/pdf' });
      formData.append('projectFiles', file);

      const res = await app.request('/api/innovators', {
        method: 'POST',
        body: formData,
      });

      expect(res.status).toBe(201);
      expect(s3Service.uploadFile).toHaveBeenCalled();
      expect(db.media.create).toHaveBeenCalled();
      expect(db.innovatorProjectFile.create).toHaveBeenCalled();
    });

    it('should reject invalid files', async () => {
      const formData = new FormData();
      formData.append('name', 'John');
      formData.append('email', 'john@example.com');
      formData.append('phoneNumber', '+1234567890');
      formData.append('country', 'USA');
      formData.append('city', 'New York');
      formData.append('specialization', 'AI');
      formData.append('projectTitle', 'Project');
      formData.append('projectDescription', 'Desc');
      formData.append('TermsOfUse', 'true');

      const badFile = new File(['a'], 'virus.exe', { type: 'application/x-msdownload' });
      formData.append('projectFiles', badFile);
      formData.append('projectFiles', badFile); // append twice to force array parsing in Hono

      const res = await app.request('/api/innovators', {
        method: 'POST',
        body: formData,
      });

      expect(res.status).toBe(400);
    });
  });
});
