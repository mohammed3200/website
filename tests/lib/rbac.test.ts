// tests/lib/rbac.test.ts
import {
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
    jest,
} from '@jest/globals';
import {
    hasPermission,
    getUserPermissions,
    createUserInvitation,
    acceptInvitation,
    SYSTEM_ROLES,
} from '@/lib/rbac';
import { RESOURCES, ACTIONS } from '@/lib/rbac-base';
import { db } from '@/lib/db';

// Mock the database
jest.mock('@/lib/db', () => ({
    db: {
        user: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        role: {
            upsert: jest.fn(),
        },
        permission: {
            upsert: jest.fn(),
            findUnique: jest.fn(),
        },
        rolePermission: {
            upsert: jest.fn(),
        },
        userInvitation: {
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        $transaction: jest.fn(),
    },
}));

describe('RBAC Library', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('hasPermission', () => {
        it('should return true if user has the specific permission', async () => {
            (db.user.findUnique as any).mockResolvedValue({
                id: 'user-1',
                isActive: true,
                role: {
                    permissions: [
                        {
                            permission: {
                                resource: RESOURCES.NEWS,
                                action: ACTIONS.READ,
                            },
                        },
                    ],
                },
            });

            const result = await hasPermission('user-1', RESOURCES.NEWS, ACTIONS.READ);
            expect(result).toBe(true);
        });

        it('should return true if user has manage permission for the resource', async () => {
            (db.user.findUnique as any).mockResolvedValue({
                id: 'user-1',
                isActive: true,
                role: {
                    permissions: [
                        {
                            permission: {
                                resource: RESOURCES.NEWS,
                                action: ACTIONS.MANAGE,
                            },
                        },
                    ],
                },
            });

            const result = await hasPermission('user-1', RESOURCES.NEWS, ACTIONS.UPDATE);
            expect(result).toBe(true);
        });

        it('should return false if user does not have the permission', async () => {
            (db.user.findUnique as any).mockResolvedValue({
                id: 'user-1',
                isActive: true,
                role: {
                    permissions: [
                        {
                            permission: {
                                resource: RESOURCES.NEWS,
                                action: ACTIONS.READ,
                            },
                        },
                    ],
                },
            });

            const result = await hasPermission('user-1', RESOURCES.USERS, ACTIONS.READ);
            expect(result).toBe(false);
        });

        it('should return false if user is inactive', async () => {
            (db.user.findUnique as any).mockResolvedValue(null);

            const result = await hasPermission('user-1', RESOURCES.NEWS, ACTIONS.READ);
            expect(result).toBe(false);
        });
    });

    describe('getUserPermissions', () => {
        it('should return an array of user permissions', async () => {
            (db.user.findUnique as any).mockResolvedValue({
                id: 'user-1',
                isActive: true,
                role: {
                    permissions: [
                        {
                            permission: {
                                resource: RESOURCES.NEWS,
                                action: ACTIONS.READ,
                            },
                        },
                        {
                            permission: {
                                resource: RESOURCES.NEWS,
                                action: ACTIONS.CREATE,
                            },
                        },
                    ],
                },
            });

            const result = await getUserPermissions('user-1');
            expect(result).toHaveLength(2);
            expect(result).toContainEqual({ resource: RESOURCES.NEWS, action: ACTIONS.READ });
            expect(result).toContainEqual({ resource: RESOURCES.NEWS, action: ACTIONS.CREATE });
        });

        it('should return empty array if user not found', async () => {
            (db.user.findUnique as any).mockResolvedValue(null);
            const result = await getUserPermissions('user-1');
            expect(result).toEqual([]);
        });
    });

    describe('createUserInvitation', () => {
        it('should create an invitation if inviter has permission', async () => {
            // Mock inviter check
            (db.user.findUnique as any).mockResolvedValue({
                id: 'admin-1',
                isActive: true,
                role: {
                    permissions: [
                        {
                            permission: {
                                resource: RESOURCES.INVITATIONS,
                                action: ACTIONS.MANAGE,
                            },
                        },
                    ],
                },
            });

            (db.userInvitation.findFirst as any).mockResolvedValue(null);
            (db.userInvitation.create as any).mockResolvedValue({ id: 'inv-1' });

            await createUserInvitation('admin-1', 'new@test.com', 'role-editor');

            expect(db.userInvitation.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        email: 'new@test.com',
                        roleId: 'role-editor',
                    }),
                })
            );
        });

        it('should throw error if inviter lacks permission', async () => {
            (db.user.findUnique as any).mockResolvedValue({
                id: 'user-1',
                isActive: true,
                role: { permissions: [] },
            });

            await expect(
                createUserInvitation('user-1', 'new@test.com', 'role-id')
            ).rejects.toThrow("You don't have permission to invite users");
        });
    });

    describe('acceptInvitation', () => {
        it('should successfully accept a valid invitation', async () => {
            const mockInvitation = {
                id: 'inv-1',
                token: 'valid-token',
                status: 'PENDING',
                expiresAt: new Date(Date.now() + 10000),
                roleId: 'role-1',
                invitedBy: 'admin-1',
            };

            (db.userInvitation.findUnique as any).mockResolvedValue(mockInvitation);

            await acceptInvitation('valid-token', 'user-1');

            expect(db.$transaction).toHaveBeenCalled();
        });

        it('should throw error for expired invitation', async () => {
            const mockInvitation = {
                id: 'inv-1',
                token: 'expired-token',
                status: 'PENDING',
                expiresAt: new Date(Date.now() - 10000),
            };

            (db.userInvitation.findUnique as any).mockResolvedValue(mockInvitation);

            await expect(
                acceptInvitation('expired-token', 'user-1')
            ).rejects.toThrow('This invitation has expired');
        });
    });
});
