"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useInfiniteSearchLocations } from "@/hooks/use-location";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/auth/use-profile";
import { LocationSearchItemType } from "@/types/location";
import LocationCard from "@/app/(main)/location/LocationCard";
import ObservationComponent from "@/components/ObservationComponent";

export default function LocationSearchPage() {
  const [keyword, setKeyword] = useState("");
  const [submitted, setSubmitted] = useState("");
  const infiniteParams = useMemo(
    () => ({ keyword: submitted || undefined, size: 20 }),
    [submitted]
  );
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteSearchLocations(infiniteParams);

  const items: LocationSearchItemType[] = useMemo(
    () => data?.pages.flatMap((p) => p.locations) || [],
    [data]
  );
  const { data: user } = useProfile();

  useEffect(() => {
    const handle = setTimeout(() => {
      setSubmitted(keyword);
    }, 1000);
    return () => clearTimeout(handle);
  }, [keyword]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6 flex gap-2">
        <Input
          placeholder="스페이스, 주소를 검색하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {submitted || keyword ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setKeyword("");
              setSubmitted("");
              if (typeof window !== "undefined")
                window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            초기화
          </Button>
        ) : null}
        {user && (
          <Link href="/location/new" className="ml-auto">
            <Button variant="secondary">스페이스 추가</Button>
          </Link>
        )}
      </div>

      {isLoading && (
        <div
          className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-6 gap-2"
          aria-live="polite"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="relative">
              <Skeleton className="w-full aspect-[4/5] rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="text-center text-sm text-gray-500 py-12">
          검색 결과가 없습니다.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-6 gap-2">
        {items.map((it: LocationSearchItemType) => (
          <LocationCard key={it.locationId} item={it} />
        ))}
      </div>

      {isFetchingNextPage && (
        <div
          className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-6 gap-2 mt-3"
          aria-live="polite"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="relative">
              <Skeleton className="w-full aspect-[4/5] rounded-xl" />
            </div>
          ))}
        </div>
      )}

      <ObservationComponent
        hasNext={Boolean(hasNextPage)}
        hasData={items.length > 0}
        fetchNextPage={() => fetchNextPage()}
      />
    </div>
  );
}
