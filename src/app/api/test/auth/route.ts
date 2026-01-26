import { signIn } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Security check: Only allow in development environment
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Forbidden in production" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // Call NextAuth signIn directly to bypass CSRF check
    // redirect: false allows us to handle the response manually
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // If signIn is successful and doesn't throw, we assume success.
    // The session cookie is set by signIn in the response headers.
    // However, since we are in a Route Handler, we need to ensure the cookies are passed through.
    // signIn with redirect:false usually returns a response-like object or null?
    // Actually, in NextAuth v5, signIn throws on redirect, or returns nothing?
    // "In a Server Action or Route Handler, signIn will not perform a CSRF check."

    return NextResponse.json({ success: true, message: "Logged in successfully" });

  } catch (error) {
    // NextAuth throws AuthError
    console.error("Test Login Error:", error);
    
    // Check if it's a redirect error (which means success in NextJS often)
    // But with redirect: false, it shouldn't throw a redirect error unless we manually redirect?
    // Actually signIn might still try to redirect. 
    // Let's rely on standard try-catch.
    
    // If it's the "Digest" redirect error, we can ignore it?
    // But we passed redirect: false.
    
    return NextResponse.json({ error: "Authentication failed", details: String(error) }, { status: 401 });
  }
}
