import { router } from '../trpc';
import { propertyRouter } from './property';

export const appRouter = router({
  property: propertyRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
