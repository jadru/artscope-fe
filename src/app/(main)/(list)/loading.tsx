import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // 스켈레톤 카드 컴포넌트
  const SkeletonCard = () => (
    <div className="aspect-[4/5] relative overflow-hidden rounded-lg">
      {/* 이미지 스켈레톤 */}
      <Skeleton className="w-full h-full" />
    </div>
  );

  return (
    <div className="px-2 md:px-4 pb-16">
      {/* 그리드 레이아웃 - page.tsx와 동일한 구조 */}
      <div className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-6 gap-1 md:gap-2">
        {/* 스켈레톤 카드들을 반복 생성 (페이지당 30개) */}
        {Array.from({ length: 30 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}
