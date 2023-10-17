'use client';

import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        mutations: {
          onError: (error: unknown) => {
            const title =
              error instanceof Error
                ? error.message
                : 'error connecting to server';

            toast.clearWaitingQueue();
            toast.error(title, {
              position: 'bottom-right',
            });
          },
        },
      },
    })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>{children}</NextUIProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
