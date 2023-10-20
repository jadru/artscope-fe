'use client';

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

import NavBar from '@/app/(feed)/Navbar';

export function Providers({ children }: { children: React.ReactNode }) {
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
      <NextUIProvider>
        <NavBar theme='light' />
        {children}
      </NextUIProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
