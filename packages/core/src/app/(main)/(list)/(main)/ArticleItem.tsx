import Link from 'next/link';

import { articleItemType } from '@/types/article';

export default function ArticleItem({ article }: { article: articleItemType }) {
  return (
    <Link className='relative p-6 group' href={'/article/' + article.id}>
      <div className='aspect-w-12 aspect-h-16 box-border overflow-hidden'>
        <img
          alt={article.title}
          src={article.mediaUrls[0]}
          className='w-full h-full object-cover bg-black transition duration-300 group-hover:scale-105 transform group-hover:-rotate-2'
        />
      </div>
      <h2 className='px-4 text-3xl text-black line-clamp-2 pt-4 font-bold break-keep'>
        {article.title}
      </h2>
      <h3 className='px-4 text-xl text-black break-keep'>
        {article.author.authorName}
      </h3>
    </Link>
  );
}
