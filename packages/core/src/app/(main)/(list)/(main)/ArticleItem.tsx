import Link from 'next/link';

import ASNextImage from '@/components/ASNextImage';
import StandardLabel, { standardLabel } from '@/components/StandardLabel';

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
          <div className='w-full h-full bg-black transition duration-300' />
        )}
      </div>
      <div className='pt-4 px-4'>
        <h2
          className={`text-2xl line-clamp-2 group-hover:underline underline-offset-3 font-bold break-keep ${
            light ? 'text-white' : 'text-black'
          }`}>
          {standardLabel(article.title)}
        </h2>
        <Link
          href={'/profile/' + article.author.authorUsername}
          className={`hover:bg-default-100 w-full pt-1 flex appearance-none items-center justify-end transition ${
            light ? 'text-white' : 'text-black'
          }`}>
          <StandardLabel label={article.author.authorName} />
        </Link>
      </div>
    </Link>
  );
}
