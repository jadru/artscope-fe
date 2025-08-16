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
      className="relative flex group flex-col bg-gray-100 md:bg-transparent p-0 items-stretch justify-center md:aspect-4/5 size-full rounded-lg overflow-hidden"
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
        className="object-cover scale-105 rounded-xl md:rounded-none drop-shadow-xl md:absolute inset-0 size-full aspect-4/5 w-full h-full"
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
        className={`md:text-gray-300 absolute inset-0 flex flex-col items-center justify-end`}
      >
        <div className="self-end bg-linear-to-tr from-black/50 *:w-full transition-opacity md:opacity-0 md:group-hover:opacity-100 to-transparent w-full h-auto pt-2.5 p-3 md:pr-2 px-4 flex flex-col justify-end">
          <h3 className="text-base text-left text-white truncate">
            {standardLabel(article.title)}
          </h3>
          <p className="text-sm text-left flex gap-1">
            <span className="text-gray-300 uppercase font-light">
              {article.categoryName}
            </span>
            <span className="text-gray-100">
              by {standardLabel(article.author.authorName)}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}
