import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { middleware } from '../src/middleware';
// Mock with type safety
jest.mock('next-auth/jwt', () => ({
  __esModule: true,
  getToken: jest.fn(),
}));

// Get the mocked function with proper typing
const mockedGetToken = getToken as jest.Mock;

// Helper function to create a mock NextRequest
const createMockRequest = (
  url: string,
  method: string = 'GET',
): NextRequest => {
  const request = new NextRequest(new URL(`http://localhost${url}`), {
    method,
  });
  return request;
};

describe('middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows access to public route without auth', async () => {
    const req = createMockRequest('/about');
    const response = await middleware(req);
    expect(response).toBeDefined();
  });

  it('redirects logged-in users away from auth route', async () => {
    mockedGetToken.mockResolvedValue({
      sub: '1',
      role: 'GENERAL_MANAGER',
      permissions: [{ resource: 'dashboard', action: 'manage' }],
    } as any);
    const req = createMockRequest('/auth/login');
    const response = await middleware(req);
    expect(response?.status).toBe(307);
    expect(response?.headers.get('location')).toBe(
      'http://localhost/admin/dashboard',
    );
  });

  it('allows access to auth route if not logged in', async () => {
    mockedGetToken.mockResolvedValue(null);
    const req = createMockRequest('/auth/login');
    const response = await middleware(req);
    expect(response).toBeDefined();
  });

  it('redirects to login if accessing admin route unauthenticated', async () => {
    mockedGetToken.mockResolvedValue(null);
    const req = createMockRequest('/admin/dashboard');
    const response = await middleware(req);
    expect(response?.status).toBe(307);
    expect(response?.headers.get('location')).toContain('/auth/login');
  });

  it('returns 403 for unauthorized admin role', async () => {
    mockedGetToken.mockResolvedValue({
      sub: '1',
      role: 'COLLABORATOR',
      permissions: [{ resource: 'something', action: 'read' }],
    } as any);
    const req = createMockRequest('/admin/dashboard');
    const response = await middleware(req);
    expect(response?.status).toBe(307);
    expect(response?.headers.get('location')).toContain(
      '/auth/error?error=AccessDenied',
    );
  });

  it('allows access to admin route for authorized role', async () => {
    mockedGetToken.mockResolvedValue({
      sub: '1',
      role: 'GENERAL_MANAGER',
      permissions: [{ resource: 'dashboard', action: 'manage' }],
    } as any);
    const req = createMockRequest('/admin/dashboard');
    const response = await middleware(req);
    expect(response).toEqual(NextResponse.next());
  });
});
