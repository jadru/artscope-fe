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
          group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-200
          ${
            clickable
              ? "hover:bg-gray-50 hover:shadow-sm border border-transparent hover:border-gray-200"
              : "bg-gray-50"
          }
          ${borderTop ? "border-t border-gray-100" : ""}
          ${borderBottom ? "border-b border-gray-100" : ""}
        `}
      >
        {/* 프로필 이미지 */}
        <div className="relative flex-shrink-0">
          <ASNextImage
            src={picture ?? "prod/images/default.jpg"}
            alt="프로필 사진"
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-200"
          />
          {clickable && (
            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
          )}
        </div>

        {/* 사용자 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              <StandardLabel label={name} />
            </h3>
            {!teamId && (
              <p className="text-sm text-gray-500 font-medium">@{username}</p>
            )}
          </div>
        </div>

        {/* 화살표 아이콘 (클릭 가능한 경우) */}
        {clickable && (
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        )}
      </div>
    </Link>
  );
}
