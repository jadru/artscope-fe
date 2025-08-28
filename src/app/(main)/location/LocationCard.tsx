"use client";

import Link from "next/link";
import React, { useMemo } from "react";

import { LocationSearchItemType } from "@/types/location";
import { standardLabel } from "@/components/StandardLabel";

export default function LocationCard({
  item,
}: {
  item: LocationSearchItemType;
}) {
  const englishName = useMemo(() => {
    const matched = (item.englishName ?? "").match(/[A-Za-z0-9 ]+/g);
    const text = matched?.join(" ").trim();
    return text && text.length > 0 ? text : "SPACE";
  }, [item.englishName]);

  return (
    <Link href={`/location/${item.locationId}`} className="block group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl transition-transform duration-200 ease-out group-hover:scale-[0.99]">
        {/* 배경 */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />

        {/* 중앙 타이포그래피 - 영어 이름 */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-center select-none">
            <div className="text-3xl md:text-4xl font-mono uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-br from-gray-800 to-gray-500 line-clamp-2">
              {englishName}
            </div>
          </div>
        </div>

        {/* 하단 보조 정보 */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-gray-700 text-sm font-light line-clamp-1">
            {standardLabel(item.name)}
          </p>
          <p className="text-gray-600 text-xs font-light line-clamp-1">
            {standardLabel(item.address)}
          </p>
        </div>
      </div>
    </Link>
  );
}
