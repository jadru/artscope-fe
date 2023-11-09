'use client';

import { load } from '@cronitorio/cronitor-rum';
import { NextUIProvider } from '@nextui-org/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import useUserHook from '@/hooks/useUser';

export function Providers({ children }: { children: React.ReactNode }) {
  useUserHook();
  useEffect(() => {
    load('YOUR_SITE_ID');
  }, []);
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
