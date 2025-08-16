import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      {/* 제목 영역 스켈레톤 */}
      <div className="max-w-screen-lg mx-auto py-10 w-full px-2">
        <div className="px-4 pt-4">
          <Skeleton className="h-12 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>

      <div className="max-w-screen-lg px-0 flex flex-col gap-2 items-stretch mx-auto">
        {/* 콘텐츠 영역 스켈레톤 */}
        <div className="bg-default-100 w-full space-y-4 rounded-xl min-h-64 p-4">
          {/* 마크다운 콘텐츠 스켈레톤 */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>

        {/* 액션 버튼 영역 스켈레톤 */}
        <div className="w-full px-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        {/* 프로필 영역 스켈레톤 */}
        <div className="w-full p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>

        {/* 댓글 영역 스켈레톤 */}
        <div className="w-full px-2.5">
          <div className="space-y-4">
            {/* 댓글 제목 */}
            <Skeleton className="h-6 w-24" />

            {/* 댓글 입력창 */}
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-10 w-full" />
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>

            {/* 댓글 목록 */}
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
