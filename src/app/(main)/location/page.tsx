"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

import { useSearchLocations } from "@/hooks/use-location";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/auth/use-profile";
import { LocationSearchItemType, LocationType } from "@/types/location";
import LocationCard from "@/app/(main)/location/LocationCard";

export default function LocationSearchPage() {
  const [keyword, setKeyword] = useState("");
  const [submitted, setSubmitted] = useState("");
  const params = useMemo(
    () => ({ keyword: submitted || undefined, page: 0, size: 20 }),
    [submitted]
  );
  const { data, isLoading } = useSearchLocations(params);

  const items: LocationSearchItemType[] = data?.locations || [];
  const { data: user } = useProfile();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6 flex gap-2">
        <Input
          placeholder="스페이스, 주소를 검색하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button onClick={() => setSubmitted(keyword)}>검색</Button>
        {user && (
          <Link href="/location/new" className="ml-auto">
            <Button variant="secondary">스페이스 추가</Button>
          </Link>
        )}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
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
    </div>
  );
}
