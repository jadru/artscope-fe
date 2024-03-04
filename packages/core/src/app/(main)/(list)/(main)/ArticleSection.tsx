import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import ArticleFullWidthItem from '@/app/(main)/(list)/(main)/ArticleFullWidthItem';
import ArticleItem from '@/app/(main)/(list)/(main)/ArticleItem';
import Logo from '@/assets/images/logo_long.svg';

import { articleItemType } from '@/types/article';

export default function ArticleSection({
  articleList,
  position,
}: {
  articleList: articleItemType[];
  position: 'right' | 'left';
}) {
  return (
    <div
      className={`px-0 md:px-0 w-screen flex flex-col ${
        position === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}>
      <div className='w-full md:w-1/2 relative self-stretch'>
        <ArticleFullWidthItem article={articleList[0]} />
        <Logo className='absolute top-8 left-8 group-hover:fill-primary w-52 overflow-hidden fill-white transition duration-100 z-40' />
      </div>
      <div className='w-full md:w-1/2 self-stretch'>
        <div className='w-full'>
          <ResponsiveMasonry
            columnsCountBreakPoints={{
              350: 1,
              1024: 2,
            }}>
            <Masonry>
              {articleList.slice(1).map((page) => (
                <ArticleItem key={page.id} article={page} />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      </div>
    </div>
  );
}
