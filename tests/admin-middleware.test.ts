// tests/admin-middleware.test.ts
import { createMocks } from "node-mocks-http";
import { middleware } from "../src/middleware";
import { NextResponse } from "next/server";

describe("Admin middleware", () => {
  it("redirects to login when no token", async () => {
    const { req, res: _res } = createMocks({
      url: "/admin/dashboard",
      method: "GET",
      cookies: {},
    });

    const result = await middleware(req as unknown as import("next/server").NextRequest);
    expect(result.status).toBe(307);
    expect(result.headers.get("location")).toBe("/auth/login");
  });

  it("forbids when role is insufficient", async () => {
    // mock a JWT cookie with wrong role
    const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"; // generate a JWT with role=COLLABORATOR
    const { req, res: _res } = createMocks({
      url: "/admin/dashboard",
      method: "GET",
      cookies: { token: fakeToken },
    });

    // stub verifyJwt to return a collaborator role
    jest.mock("../src/lib/security", () => ({
      verifyJwt: () => ({ userId: "1", role: "COLLABORATOR" }),
    }));

    const result = await middleware(req as unknown as import("next/server").NextRequest);
    expect(result.status).toBe(403);
  });

  it("allows when role is sufficient", async () => {
    const managerToken = "eyJ..."; // JWT with role=GENERAL_MANAGER
    const { req } = createMocks({
      url: "/admin/dashboard",
      method: "GET",
      cookies: { token: managerToken },
    });

    jest.mock("../src/lib/security", () => ({
      verifyJwt: () => ({ userId: "1", role: "GENERAL_MANAGER" }),
    }));

    const result = await middleware(req as unknown as import("next/server").NextRequest);
    expect(result).toEqual(NextResponse.next());
  });
});
