"use client";
import * as Cronitor from "@cronitorio/cronitor-rum";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { CRONITOR_ANALYTICS_KEY } from "@/constant/env";
import { ThemeProvider } from "@/components/theme/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Cronitor.load(CRONITOR_ANALYTICS_KEY ?? "", {
      debug: process.env.NODE_ENV === "development",
    });
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
      <ThemeProvider>{children}</ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
