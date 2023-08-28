'use client';

import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import React from 'react';
import { RecoilRoot } from 'recoil';

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(new QueryClient());
  return (
    <NextUIProvider>
      <QueryClientProvider client={client}>
        <ReactQueryStreamedHydration>
          <RecoilRoot>{children}</RecoilRoot>
        </ReactQueryStreamedHydration>
      </QueryClientProvider>
    </NextUIProvider>
  );
}
