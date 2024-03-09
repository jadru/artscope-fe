import Link from 'next/link';

import ASNextImage from '@/components/ASNextImage';
import { standardLabel } from '@/components/StandardLabel';

import { articleItemType } from '@/types/article';

export default function ArticleFullWidthItem({
  article,
}: {
  article: articleItemType;
}) {
  return (
    <Link href={'/article/' + article.id}>
      <div className='sticky top-0 h-screen group box-border overflow-hidden'>
        <ASNextImage
          alt={article.title}
          src={article.mediaUrls[0]}
          width={1000}
          height={1000}
          className='left-0 top-0 w-full h-full object-cover'
        />
        <div className='absolute top-0 group-hover:underline underline-offset-3 decoration-3 decoration-white right-0 p-10 w-full h-full bg-gradient-to-tr from-black/80 to-black/0 flex flex-col justify-end'>
          <div>
            <h2 className='text-5xl font-bold text-white break-keep pt-4'>
              {standardLabel(article.title)}
            </h2>
            <h3 className='text-xl text-white break-keep'>
              {standardLabel(article.author.authorName)}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}
