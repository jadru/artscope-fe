import Link from 'next/link';

import ASNextImage from '@/components/ASNextImage';

import { articleItemType } from '@/types/article';

export default function ArticleItem({
  article,
  light = false,
}: {
  article: articleItemType;
  light?: boolean;
}) {
  return (
    <Link className='relative p-3 lg:p-6 group' href={'/article/' + article.id}>
      <div
        className={`aspect-w-5 aspect-h-3 lg:aspect-w-12 lg:aspect-h-16 box-border overflow-hidden ${
          light ? 'text-white' : 'text-black'
        }`}>
        {article.mediaUrls[0] &&
        article.mediaUrls[0] !== 'https://cdn.artscope.kr/undefined' ? (
          <ASNextImage
            alt={article.title}
            src={article.mediaUrls[0]}
            width={300}
            height={300}
            className='w-full h-full object-cover bg-black transition duration-300 group-hover:scale-105 transform'
          />
        ) : (
          <div className='w-full h-full bg-black transition duration-300 group-hover:scale-105 transform group-hover:-rotate-2' />
        )}
      </div>
      <h2
        className={`px-4 text-2xl line-clamp-2 pt-4 font-bold break-keep ${
          light ? 'text-white' : 'text-black'
        }`}>
        {article.title}
      </h2>
      <h3
        className={`px-4 text-xl break-keep ${
          light ? 'text-white' : 'text-black'
        }`}>
        {article.author.authorName}
      </h3>
    </Link>
  );
}
