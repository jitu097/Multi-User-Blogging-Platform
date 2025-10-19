import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/trpc(.*)'
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    const { userId } = await auth()
    if (!userId) {
      // Redirect to Clerk sign-in and request a post-sign-in redirect to /dashboard
      const redirectTo = '/sign-in?redirect_url=' + encodeURIComponent('/dashboard')
      return Response.redirect(new URL(redirectTo, request.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}