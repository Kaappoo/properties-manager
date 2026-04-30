import { router } from '../trpc';
import { propertyRouter } from './property';
import { userRouter } from './user';
import { companyRouter } from './company';

export const appRouter = router({
  property: propertyRouter,
  user: userRouter,
  company: companyRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
