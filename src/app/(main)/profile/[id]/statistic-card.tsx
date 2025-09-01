"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { articleListType } from "@/types/article";
import jxios from "@/utils/jxios";
import { useQuery } from "@tanstack/react-query";

const LIMIT = 16;
const fetchFeeds = async (page: number, username: string) =>
  await jxios
    .get("/api/server/magazines/members/" + username, {
      params: {
        page: page,
        size: LIMIT,
      },
    })
    .then((res) => res.data as articleListType);

export default function StatisticCard({ username }: { username: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["articleList", username, 0],
    queryFn: () => fetchFeeds(0, username),
  });
  return (
    <div className="flex gap-12">
      <div className="text-center">
        {!isLoading ? (
          <div className="text-2xl font-light text-gray-900">
            {data?.pageInfo.totalElements}
          </div>
        ) : (
          <div className="text-2xl font-light text-gray-900">
            <Skeleton className="w-8 h-8" />
          </div>
        )}
        <div className="text-sm text-gray-500">작품</div>
      </div>
      {/* <div className="text-center">
        <div className="text-2xl font-light text-gray-900">1.2k</div>
        <div className="text-sm text-gray-500">팔로워</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-light text-gray-900">98</div>
        <div className="text-sm text-gray-500">좋아요</div>
      </div> */}
    </div>
  );
}
