'use client';

import { useCronitor } from '@cronitorio/cronitor-rum-nextjs';
import { NextUIProvider } from '@nextui-org/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import useUserHook from '@/hooks/useUser';

import { CRONITOR_ANALYTICS_KEY } from '@/constant/env';

export function Providers({ children }: { children: React.ReactNode }) {
  useCronitor(CRONITOR_ANALYTICS_KEY ?? '', {
    debug: process.env.NODE_ENV === 'development',
  });
  useUserHook();
  const [queryClient] = useState(
    new QueryClient({
      queryCache: new QueryCache({
        onError: (error) =>
          toast.error(`Something went wrong: ${error.message}`),
      }),
    })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>{children}</NextUIProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
