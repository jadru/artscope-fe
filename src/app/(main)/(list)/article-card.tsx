import { standardLabel } from "@/components/StandardLabel";
import { articleListType } from "@/types/article";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ArticleCard({
  article,
}: {
  article: articleListType["magazines"][number];
}) {
  const [isError, setIsError] = useState(false);
  return (
    <Link
      href={`/article/${article.id}`}
      key={article.id}
      className="relative flex flex-col items-center justify-center aspect-square size-full rounded-lg overflow-hidden border-2 border-gray-100"
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
        className="object-cover absolute inset-0 size-full"
      />
      {isError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 p-3">
          <h3 className="text-3xl font-bold text-left break-keep text-gray-500">
            {standardLabel(article.title)}
          </h3>
        </div>
      )}
      <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 absolute inset-0 flex p-2 flex-col items-center justify-center bg-black/50 break-keep">
        <p className="text-sm text-center text-gray-300">{article.category}</p>
        <h3 className="text-sm font-bold text-center text-white">
          {standardLabel(article.title)}
        </h3>
        <p className="text-sm text-center text-gray-300">
          by {standardLabel(article.author.authorName)}
        </p>
      </div>
    </Link>
  );
}
