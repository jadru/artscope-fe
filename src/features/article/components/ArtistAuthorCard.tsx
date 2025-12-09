"use client";

import Image from "next/image";
import Link from "next/link";
import { AuthorType } from "@/types/article";

interface ArtistAuthorCardProps {
  author: AuthorType;
}

export default function ArtistAuthorCard({ author }: ArtistAuthorCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Link
          href={`/profile/${author.authorUsername}`}
          className="flex-shrink-0"
        >
          <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
            {author.authorProfileImage ? (
              <Image
                src={author.authorProfileImage}
                alt={author.authorName}
                fill
                className="object-cover transition-opacity hover:opacity-80"
                sizes="64px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-gray-400 dark:text-gray-600">
                {author.authorName.charAt(0)}
              </div>
            )}
          </div>
        </Link>

        {/* Author Info */}
        <div className="flex-1 space-y-1">
          <div>
            <Link
              href={`/profile/${author.authorUsername}`}
              className="text-base font-semibold text-gray-900 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300"
            >
              {author.authorName}
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              @{author.authorUsername}
            </p>
          </div>

          {(author.authorCompanyRole || author.authorCompanyName) && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              {author.authorCompanyRole && (
                <span className="font-medium">{author.authorCompanyRole}</span>
              )}
              {author.authorCompanyRole && author.authorCompanyName && (
                <span className="text-gray-400 dark:text-gray-600">·</span>
              )}
              {author.authorCompanyName && (
                <span>{author.authorCompanyName}</span>
              )}
            </div>
          )}
        </div>

        {/* Follow Button */}
        <button
          className="flex-shrink-0 rounded-full border border-gray-900 px-4 py-1.5 text-xs font-medium text-gray-900 transition-colors hover:bg-gray-900 hover:text-white dark:border-gray-100 dark:text-gray-100 dark:hover:bg-gray-100 dark:hover:text-gray-900"
          onClick={() => {
            // TODO: Implement follow functionality
            console.log("Follow", author.authorUsername);
          }}
        >
          팔로우
        </button>
      </div>
    </div>
  );
}
