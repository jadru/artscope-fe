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
        onError: (_error, query) => {
          // 화면에서 직접 에러 상태(다시 시도)를 보여주는 쿼리는 토스트를 띄우지 않는다.
          if (query.meta?.inlineError) return;
          toast.error("일시적인 오류로 정보를 불러오지 못했어요.", {
            toastId: "query-error",
          });
        },
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
