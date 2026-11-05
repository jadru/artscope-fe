"use client";

import { RiErrorWarningLine } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

interface LoadErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

/**
 * 콘텐츠 로딩 실패 시 보여주는 공통 에러 상태.
 * 원본 에러 메시지(영문 axios 메시지 등)는 노출하지 않는다.
 */
export default function LoadErrorState({
  title = "콘텐츠를 불러오지 못했어요",
  description = "일시적인 문제일 수 있어요. 잠시 후 다시 시도해 주세요.",
  onRetry,
  isRetrying = false,
  className,
}: LoadErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center px-4 py-16 text-center",
        className
      )}
    >
      <RiErrorWarningLine
        aria-hidden="true"
        className="h-10 w-10 text-gray-400"
      />
      <h2 className="mt-4 text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-gray-600">{description}</p>
      {onRetry && (
        <Button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-6 h-11 min-w-[120px] rounded-full bg-gray-900 px-6 text-sm font-medium text-white hover:bg-gray-800"
        >
          {isRetrying ? "다시 불러오는 중…" : "다시 시도"}
        </Button>
      )}
    </div>
  );
}
