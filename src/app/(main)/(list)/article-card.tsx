import { standardLabel } from "@/components/StandardLabel";
import { articleListType } from "@/types/article";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleCard({
  article,
}: {
  article: articleListType["magazines"][number];
}) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Link
      href={`/article/${article.id}`}
      key={article.id}
      className="relative flex flex-col px-2 pt-2 bg-gray-100 md:bg-transparent md:px-0 md:pt-0 items-stretch justify-center md:aspect-square size-full rounded-lg overflow-hidden border-2 border-gray-100"
    >
      <Image
        src={article.mediaUrls[0]}
        alt={article.title}
        width={240}
        height={240}
        onError={(e) => {
          e.currentTarget.src = "/images/default-image.png";
          setIsError(true);
        }}
        onLoad={() => setIsLoading(false)}
        className="object-cover rounded-xl md:rounded-none drop-shadow-xl md:absolute inset-0 size-full aspect-square w-full h-full"
      />
      {isLoading && <Skeleton className="absolute inset-0 size-full" />}
      {isError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 p-3">
          <h3 className="text-lg font-bold text-left break-keep text-gray-500 uppercase line-clamp-2">
            {standardLabel(article.title)}
          </h3>
        </div>
      )}
      <div
        className={`${
          isError ? "opacity-100" : "md:opacity-0"
        } text-gray-500 md:text-gray-300 md:hover:opacity-100 *:w-full transition-opacity duration-300 md:absolute inset-0 flex pt-2.5 p-3 md:pr-2 md:p-2 flex-col items-center justify-center md:bg-black/50 px-4`}
      >
        <p className="text-sm text-center">{article.categoryName}</p>
        <h3 className="text-sm font-bold text-center text-gray-700 md:text-white truncate">
          {standardLabel(article.title)}
        </h3>
        <p className="text-sm text-center">
          by {standardLabel(article.author.authorName)}
        </p>
      </div>
    </Link>
  );
}
