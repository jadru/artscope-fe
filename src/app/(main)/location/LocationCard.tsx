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
    return standardLabel(text && text.length > 0 ? text : item.name);
  }, [item.englishName, item.name]);

  return (
    <Link href={`/location/${item.locationId}`} className="block group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl transition-transform duration-200 ease-out md:group-hover:scale-[0.99]">
        {/* 배경 */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />

        {/* 중앙 타이포그래피 - 영어 이름 */}
        <div className="absolute inset-0 flex items-center justify-center p-4 overflow-hidden tracking-normal md:group-hover:overflow-visible break-keep">
          <div className="text-left select-none">
            <div className="w-fit text-lg md:group-hover:scale-120 md:group-hover:font-bold md:group-hover:tracking-tight transition-transform duration-200 ease-out font-serif uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-br from-gray-800 to-gray-500">
              {englishName}
            </div>
          </div>
        </div>

        {/* 하단 보조 정보 */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 ease-out bg-white/70 md:bg-transparent md:group-hover:bg-white/70 backdrop-blur-sm md:backdrop-blur-0 md:group-hover:backdrop-blur-sm">
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
