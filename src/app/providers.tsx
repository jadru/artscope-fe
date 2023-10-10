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

import Footer from '@/components/Footer';

import NavBar from '@/app/(feed)/Navbar';
import { useUser } from '@/states';

export function Providers({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState(true);
  useToken({ setIsLoading });
  const { user } = useUser();
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
      <NextUIProvider>
        <NavBar theme='light' user={user} isLoading={isLoading} />
        <div className='container mx-auto min-h-screen max-w-[1024px]'>
          {children}
        </div>
        <Footer />
      </NextUIProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
