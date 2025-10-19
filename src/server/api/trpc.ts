/**
 * tRPC setup - this is where we configure our type-safe API
 * tRPC gives us end-to-end type safety from backend to frontend
 */

import { TRPCError, initTRPC } from "@trpc/server";
import { auth } from "@clerk/nextjs/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@/server/db";

/**
 * Create context for each request
 * Includes database and Clerk authentication info
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const authResult = await auth();
  const userId = authResult.userId;
  const sessionId = authResult.sessionId;
  
  return {
    db, // Database access
    userId, // Clerk user ID (null if not signed in)
    sessionId, // Clerk session ID
    ...opts,
  };
};

// Initialize tRPC with our config
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson, // Handles dates and other complex types
  errorFormatter({ shape, error }) {
    // Make Zod validation errors easier to work with on the frontend
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// Export these to use in your API routes
export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure; // Anyone can call this

/**
 * Protected procedure - requires user to be signed in with Clerk
 * Throws UNAUTHORIZED error if no valid session exists
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  // Check if user is authenticated via Clerk
  if (!ctx.userId || !ctx.sessionId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be signed in to perform this action',
    });
  }

  // Pass userId to the procedure so it can use it
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId, // Now TypeScript knows userId is definitely not null
      sessionId: ctx.sessionId,
    },
  });
});