"use client";

import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

export default function ClientClerkProvider({ children }: { children: React.ReactNode }) {
  // Clerk reads NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY automatically on the client.
  // Rendering Clerk only on the client prevents server-side prerender errors
  // when the publishable key is a placeholder during local builds.
  return <ClerkProvider>{children}</ClerkProvider>;
}
