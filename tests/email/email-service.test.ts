import { SendMailOptions } from 'nodemailer';
import { describe, it, expect, jest, mock } from 'bun:test';

// Mock nodemailer BEFORE anything else
const sendMailMock = jest.fn().mockResolvedValue({
  messageId: 'test-id',
  accepted: ['test@test.com'],
});

const mockCreateTransport = jest.fn().mockReturnValue({
  sendMail: sendMailMock,
  close: jest.fn(),
});

mock.module('nodemailer', () => ({
  default: {
    createTransport: mockCreateTransport,
  },
  createTransport: mockCreateTransport,
}));

describe('Nodemailer transport - integration send', () => {
  it('should send an email using mocked transport', async () => {
    // Dynamically import the transport factory to ensure the mock is picked up
    const { createNodemailerTransport } = await import('../../src/lib/email/transports/nodemailer');
    
    const from = 'test@test.com';
    const to = 'wwyuu799@gmail.com';
    const mailOptions: SendMailOptions = {
      from,
      to,
      subject: 'Test',
      text: 'Test',
    };

    const transport = createNodemailerTransport();
    const info = await transport.sendMail(mailOptions);

    expect(info).toBeDefined();
    expect(info.messageId).toBe('test-id');
    expect(sendMailMock).toHaveBeenCalled();
  });
});
