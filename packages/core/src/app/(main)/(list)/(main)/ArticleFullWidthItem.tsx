import Link from 'next/link';

import ASNextImage from '@/components/ASNextImage';

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
          className='left-0 top-0 w-full h-full object-cover group-hover:scale-105 transform group-hover:-rotate-2 transition duration-300'
        />
        <div className='absolute left-3 right-3 px-4 pb-6 pt-2 bottom-3 backdrop-blur w-2/3 bg-gradient-to-tr from-black/80 to-black/0 rounded-md'>
          <h2 className='px-4 text-3xl text-white break-keep pt-4'>
            {article.title}
          </h2>
          <h3 className='px-4 text-xl text-white break-keep'>
            {article.author.authorName}
          </h3>
        </div>
      </div>
    </Link>
  );
}
