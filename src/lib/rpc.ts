import { hc } from "hono/client";

import { AppType } from "@/app/api/[[...route]]/route";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    // In the browser, use a relative URL so it forwards to the same domain automatically
    return "";
  }
  // On the server, use the environment variable or fallback to localhost
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export const client = hc<AppType>(getBaseUrl());