"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { onSuccess } from "@/app/user/onSuccess";
import jxios from "@/utils/jxios";

import { profileApiResponseType } from "@/types/profile";

// 프로필 API 호출 함수
const fetchProfile = async (): Promise<profileApiResponseType> => {
  const res = await jxios.get("/api/server/auth/me", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status !== 200) {
    throw new Error("프로필을 가져오는데 실패했습니다.");
  }

  return res.data;
};

// TanStack Query를 사용한 프로필 훅
export const useProfile = (router?: AppRouterInstance) => {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // 서버 API로 인증 상태 확인 (경량)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/state", { credentials: "include" });
        const json = (await res.json()) as { authenticated: boolean };
        if (!cancelled) setIsAuthenticated(json.authenticated);
      } catch {
        if (!cancelled) setIsAuthenticated(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    // 인증 여부 확인 전(null)에는 대기, false면 미요청
    enabled: isAuthenticated === true,
  });

  // 성공 시 라우터 처리
  useEffect(() => {
    if (query.data && router) {
      onSuccess(query.data.roleStatus, router);
    }
  }, [query.data, router]);

  // 에러 발생 시 프로필을 undefined로 설정
  useEffect(() => {
    if (query.error) {
      // 401 에러 (인증 실패)인 경우에도 프로필을 undefined로 설정
      queryClient.setQueryData(["profile"], undefined);
    }
  }, [query.error, queryClient]);

  return query;
};

// 기존 함수와의 호환성을 위한 래퍼 함수
export const onGetProfile = async (
  router: AppRouterInstance,
  setUser: (user: profileApiResponseType | undefined) => void,
  refresh?: string | undefined
) => {
  if (refresh) {
    try {
      const data = await fetchProfile();
      setUser(data);
      onSuccess(data.roleStatus, router);
    } catch (error) {
      setUser(undefined);
    }
  } else {
    setUser(undefined);
  }
};
