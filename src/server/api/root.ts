import { postRouter } from "@/server/api/routers/post";
import { categoryRouter } from "@/server/api/routers/category";
import { tagRouter } from "@/server/api/routers/tag";
import { userRouter } from "@/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  category: categoryRouter,
  tag: tagRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);