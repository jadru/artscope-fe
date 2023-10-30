'use client';

import Link from 'next/link';
import { ClassAttributes, HTMLAttributes, JSX } from 'react';
import HTMLRenderer from 'react-html-renderer';

import PostComment from '@/app/(viewer)/post/[[...slug]]/comment';
import SinglePostEdit from '@/app/(viewer)/post/[[...slug]]/SinglePostEdit';
import SinglePostItemAction from '@/app/(viewer)/post/[[...slug]]/SinglePostItemAction';
import SinglePostProfile from '@/app/(viewer)/post/[[...slug]]/SinglePostProfile';

import { SinglePostType } from '@/types/feed';

export default function SinglePostItem({
  feed,
  editMode,
}: {
  feed: SinglePostType;
  editMode: boolean;
}) {
  return !editMode ? (
    <div>
      <div className='border-default-200 bg-white pb-2 transition-colors md:mx-0'>
        <div className='flex w-full flex-col justify-between text-left md:flex-row'>
          <div className='w-full'>
            <SinglePostProfile feed={feed} />
            <hr />

            <div className='flex flex-col justify-start px-1.5'>
              <div className='flex w-full flex-col gap-1 break-keep p-3'>
                <HTMLRenderer
                  html={feed.content}
                  components={{
                    p: (
                      props: JSX.IntrinsicAttributes &
                        ClassAttributes<HTMLParagraphElement> &
                        HTMLAttributes<HTMLParagraphElement>
                    ) => (
                      <p
                        className='w-full overflow-x-hidden break-keep text-xl leading-relaxed tracking-wide text-default-800'
                        {...props}
                      />
                    ),
                    a: Link,
                  }}
                />
                {/* {textInUrlSeperator( */}
                {/*   feed.content.replace(/<[^>]*>?/g, '') */}
                {/* ).map((item, index) => { */}
                {/*   if (item.type === 'text') { */}
                {/*     return ( */}
                {/*       <p */}
                {/*         key={index} */}
                {/*         className='inline text-lg text-default-800 ' */}
                {/*       > */}
                {/*         {convertNewlineToJSX(item.value)} */}
                {/*       </p> */}
                {/*     ); */}
                {/*   } else { */}
                {/*     return ( */}
                {/*       <Link */}
                {/*         key={item.value} */}
                {/*         href={item.value} */}
                {/*         target='_blank' */}
                {/*         rel='noopener noreferrer' */}
                {/*         className='inline text-lg text-blue-500 hover:underline ' */}
                {/*       > */}
                {/*         {item.value} */}
                {/*       </Link> */}
                {/*     ); */}
                {/*   } */}
                {/* })} */}
              </div>
            </div>
            {feed.updatedTime ? (
              <p className='mx-1.5 mt-0.5 text-right text-default-500'>
                {new Date(feed.updatedTime).toLocaleString('ko-KR', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                }) + ' 수정'}
              </p>
            ) : (
              <p className='mx-1.5 mt-1 text-right text-default-500'>
                {new Date(feed.createdTime).toLocaleString('ko-KR', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                }) + ' 작성'}
              </p>
            )}
          </div>
        </div>
        <SinglePostItemAction feed={feed} />
      </div>
      <PostComment post={feed} />
    </div>
  ) : (
    <SinglePostEdit feed={feed} />
  );
}
