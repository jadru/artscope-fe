"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import jxios from "@/utils/jxios";
import { useProfile } from "@/auth/use-profile";

interface UseLikeOptions {
  articleId: number;
  initialLikes: number;
  initialIsLiked: boolean;
  onSuccess?: (newLikes: number, isLiked: boolean) => void;
  onError?: (error: unknown) => void;
}

interface UseLikeReturn {
  isLiked: boolean;
  likes: number;
  toggleLike: (e?: React.MouseEvent) => Promise<void>;
  isLoading: boolean;
}

/**
 * 좋아요 기능을 위한 커스텀 훅
 *
 * Features:
 * - 낙관적 UI 업데이트 (Optimistic Updates)
 * - 에러 시 자동 롤백
 * - React Query 캐시 무효화
 * - 로그인 체크
 */
export function useLike({
  articleId,
  initialLikes,
  initialIsLiked,
  onSuccess,
  onError,
}: UseLikeOptions): UseLikeReturn {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useProfile();

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLike = async (e?: React.MouseEvent) => {
    // 이벤트 버블링 방지 (카드 클릭과 충돌 방지)
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // 로그인 체크
    if (!user) {
      router.push("/user/login");
      return;
    }

    // 이미 요청 중이면 중복 요청 방지
    if (isLoading) return;

    // 이전 상태 저장 (롤백용)
    const previousIsLiked = isLiked;
    const previousLikes = likes;

    // Optimistic Update
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? likes + 1 : Math.max(0, likes - 1);

    setIsLiked(newIsLiked);
    setLikes(newLikes);
    setIsLoading(true);

    try {
      const endpoint = previousIsLiked ? "unlike" : "like";
      const response = await jxios.post(
        `/api/server/magazines/${articleId}/${endpoint}`
      );

      // 서버 응답으로 최종 동기화
      if (response.status === 200) {
        const serverLikes = response.data?.likes;
        const serverIsLiked = response.data?.isLiked;

        if (typeof serverLikes === "number") {
          setLikes(serverLikes);
        }
        if (typeof serverIsLiked === "boolean") {
          setIsLiked(serverIsLiked);
        }

        // React Query 캐시 무효화 (다른 컴포넌트 동기화)
        queryClient.invalidateQueries({
          queryKey: ["articles"],
          refetchType: "none", // 백그라운드 리페치 방지 (낙관적 업데이트 유지)
        });

        // 성공 콜백
        onSuccess?.(serverLikes ?? newLikes, serverIsLiked ?? newIsLiked);
      }
    } catch (error) {
      // 에러 발생 시 롤백
      setIsLiked(previousIsLiked);
      setLikes(previousLikes);

      // 에러 콜백
      onError?.(error);

      console.error("Failed to toggle like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLiked,
    likes,
    toggleLike,
    isLoading,
  };
}
