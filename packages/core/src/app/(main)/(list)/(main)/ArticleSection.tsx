import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import ArticleFullWidthItem from '@/app/(main)/(list)/(main)/ArticleFullWidthItem';
import ArticleItem from '@/app/(main)/(list)/(main)/ArticleItem';

import { articleItemType } from '@/types/article';

export default function ArticleSection({
  articleList,
  position,
  index,
}: {
  articleList: articleItemType[];
  position: 'right' | 'left';
  index: number;
}) {
  return (
    <div
      className={`px-0 md:px-0 w-screen flex flex-col ${
        position === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}>
      <div className='w-full md:w-1/2 relative self-stretch'>
        <ArticleFullWidthItem article={articleList[0]} />
      </div>
      <div className='w-full md:w-1/2 self-stretch p-1 lg:py-8 lg:p-3 bg-[rgb(33,58,250)]'>
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            350: 1,
            1024: 2,
          }}>
          <Masonry>
            {articleList.slice(1).map((page) => (
              <ArticleItem key={page.id} article={page} light />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </div>
  );
}
