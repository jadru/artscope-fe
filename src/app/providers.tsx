'use client';

import { NextUIProvider } from '@nextui-org/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { toast } from 'react-toastify';

import useToken from '@/hooks/useToken';

export function Providers({ children }: { children: React.ReactNode }) {
  useToken();
  const [queryClient] = React.useState(
    new QueryClient({
      queryCache: new QueryCache({
        onError: (error) =>
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          toast.error(`Something went wrong: ${error.message || error}`),
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
