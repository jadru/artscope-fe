import Link from 'next/link';

import { articleItemType } from '@/types/article';

export default function ArticleFullWidthItem({
  article,
}: {
  article: articleItemType;
}) {
  return (
    <Link href={'/article/' + article.id}>
      <div className='sticky top-0 h-screen -z-10 group'>
        <img
          alt={article.title}
          src={article.mediaUrls[0]}
          className='absolute left-0 top-0 w-full h-full object-cover -z-10 group-hover:scale-105 transform transition duration-300'
        />
        <div className='absolute left-0 top-0 w-full h-full bg-black/50 -z-10'></div>
        <div className='absolute left-0 px-12 top-1/2 -translate-y-1/2'>
          <h2 className='px-4 text-4xl text-white break-keep pt-4'>
            {article.title}
          </h2>
          <h3 className='px-4 text-2xl text-white break-keep'>
            {article.author.authorName}
          </h3>
        </div>
      </div>
    </Link>
  );
}
