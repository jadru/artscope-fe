"use client";

import Link from "next/link";

import ASNextImage from "@/components/ASNextImage";
import StandardLabel from "@/components/StandardLabel";

export default function ProfileComponent({
  name,
  username,
  picture,
  clickable = true,
  borderTop = false,
  borderBottom = false,
  teamId,
}: {
  username: string;
  name: string;
  picture?: string;
  clickable?: boolean;
  borderTop?: boolean;
  borderBottom?: boolean;
  teamId?: number | null;
}) {
  return (
    <Link
      className={clickable ? "cursor-pointer" : "cursor-default"}
      href={`${
        clickable ? (!teamId ? "/profile/" + username : "/team/" + teamId) : "#"
      }`}
    >
      <div
        className={`
          group flex items-center gap-4 py-4 transition-opacity duration-200
          ${clickable ? "hover:opacity-80" : ""}
          ${borderTop ? "border-t border-gray-200 pt-6" : ""}
          ${borderBottom ? "border-b border-gray-200 pb-6" : ""}
        `}
      >
        {/* 프로필 이미지 */}
        <div className="flex-shrink-0">
          <ASNextImage
            src={picture ?? "prod/images/default.jpg"}
            alt="프로필 사진"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
        </div>

        {/* 사용자 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            <h3 className="text-lg font-light text-gray-900">
              <StandardLabel label={name} />
            </h3>
            {!teamId && (
              <p className="text-sm font-light text-gray-500">@{username}</p>
            )}
          </div>
        </div>

        {/* 화살표 아이콘 (클릭 가능한 경우) */}
        {clickable && (
          <div className="flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        )}
      </div>
    </Link>
  );
}
