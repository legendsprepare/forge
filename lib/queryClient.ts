import { QueryClient } from '@tanstack/react-query';
import * as Sentry from 'sentry-expo';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (error: any) => {
        Sentry.Native.captureException(error);
      },
    },
    mutations: {
      retry: 2,
      onError: error => {
        Sentry.Native.captureException(error);
      },
    },
  },
});
