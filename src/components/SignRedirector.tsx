"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Component that handles post-authentication redirect to dashboard.
 * Only redirects when user has just completed sign-in (indicated by redirect_url parameter).
 * This prevents unwanted redirects when navigating while already authenticated.
 */
export default function SignRedirector() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoaded) return;
    
    // Only redirect if user is signed in AND came from sign-in page
    const shouldRedirect = searchParams?.get('redirect_url');
    if (isSignedIn && shouldRedirect) {
      router.replace('/dashboard');
    }
  }, [isLoaded, isSignedIn, searchParams, router]);

  return null;
}
