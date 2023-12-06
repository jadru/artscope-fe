'use client';

import { Kbd } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdArrowForwardIos } from 'react-icons/md';

import ResponsiveGrid from '@/components/ResponsiveGrid';
import Title from '@/components/Title';

import FeedListItemPost from '@/app/(main)/(list)/(feed)/FeedListItem/FeedListItemPost';
import AgoraItem from '@/app/(main)/(list)/agoras/AgoraItem';
import ArtworkItem from '@/app/(main)/(list)/artworks/ArtworkItem';
import jxios from '@/utils/jxios';

import { searchType } from '@/types/search';

export default function Search() {
  const [data, setData] = useState<searchType>();
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const initialSearchKeyword = searchParams.get('c');
  const initialSearchType = searchParams.get('type');

  const fetchSearch = useCallback(
    async (search: string | null, searchType: string | null) => {
      push(`/search?c=${search ?? ''}&type=${searchType ?? 'ALL'}`);
      await jxios
        .get('/api/search', {
          params: {
            keyword: search ?? '',
            size: 6,
          },
        })
        .then((res) => {
          setData(res.data);
        });
    },
    [push]
  );

  useEffect(() => {
    fetchSearch(initialSearchKeyword, initialSearchType ?? 'ALL');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSearch]);

  return (
    <div className='mb-2 flex flex-col items-stretch justify-center gap-2 px-2'>
      <Title title='Search' description='예술을 검색하세요.' divider={false} />
      <div className='border-default-400 flex h-16 w-full items-center space-x-2 rounded-2xl border px-2.5 py-2'>
        <AiOutlineSearch className='inline' size={25} />
        <input
          type='search'
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              fetchSearch(e.currentTarget.value, initialSearchType ?? 'ALL');
            }
          }}
          defaultValue={initialSearchKeyword ?? ''}
          autoFocus={!initialSearchKeyword}
          placeholder='검색어를 입력하세요'
          className='inline h-full w-full border-0 bg-transparent text-2xl focus:border-0 focus:outline-none focus:ring-0'
        />
        <Kbd keys={['enter']} className='h-6'>
          Enter
        </Kbd>
      </div>
      {data &&
        (data.searchArtworks.artworks.length > 0 ? (
          <div className='border-default-400 w-full rounded-2xl border py-2'>
            <>
              <h3 className='mx-3 mb-2'>아트워크 검색 결과</h3>
              <div className='px-2'>
                <ResponsiveGrid>
                  {data.searchArtworks.artworks.map((item) => (
                    <ArtworkItem
                      artwork={{ artwork: item, isLiked: false }}
                      key={item.id}
                    />
                  ))}
                </ResponsiveGrid>
                {data.searchArtworks.pageInfo.totalElements > 6 && (
                  <div className='hover:bg-default-100 mx-2 flex cursor-pointer items-center justify-start rounded-2xl px-3 py-2 transition'>
                    <p>
                      {data.searchArtworks.pageInfo.totalElements}개의 아트워크
                      검색결과 더보기
                    </p>
                    <MdArrowForwardIos className='ml-1 inline' />
                  </div>
                )}
              </div>
            </>
          </div>
        ) : (
          <div className='border-default-400 w-full rounded-2xl border py-2'>
            <h3 className='text-default-500 py-14 text-center'>
              아트워크 검색 결과가 없습니다.
            </h3>
          </div>
        ))}

      {data &&
        (data.searchPosts.posts.length > 0 ? (
          <div className='border-default-400 w-full rounded-2xl border py-2'>
            <h3 className='mx-3 mb-2'>포스트 검색 결과</h3>
            <div className='px-2'>
              {data.searchPosts.posts.map((item) => (
                <FeedListItemPost feed={item} key={item.id} />
              ))}
            </div>
            {data.searchPosts.pageInfo.totalElements > 6 && (
              <div className='hover:bg-default-100 mx-2 flex cursor-pointer items-center justify-start rounded-2xl px-3 py-2 transition'>
                <p>
                  {data.searchPosts.pageInfo.totalElements}개의 포스트 검색결과
                  더보기
                </p>
                <MdArrowForwardIos className='ml-1 inline' />
              </div>
            )}
          </div>
        ) : (
          <div className='border-default-400 w-full rounded-2xl border py-2'>
            <h3 className='text-default-500 py-14 text-center'>
              포스트 검색 결과가 없습니다.
            </h3>
          </div>
        ))}
      {data &&
        (data.searchAgoras.agoras.length > 0 ? (
          <div className='border-default-400 w-full rounded-2xl border py-2'>
            <h3 className='mx-3 mb-2'>아고라 검색 결과</h3>
            <div className='px-2'>
              {data.searchAgoras.agoras.map((item) => (
                <AgoraItem agora={item} key={item.id} />
              ))}
            </div>
            {data.searchAgoras.pageInfo.totalElements > 6 && (
              <div className='hover:bg-default-100 mx-2 flex cursor-pointer items-center justify-start rounded-2xl px-3 py-2 transition'>
                <p>
                  {data.searchAgoras.pageInfo.totalElements}개의 아고라 검색결과
                  더보기
                </p>
                <MdArrowForwardIos className='ml-1 inline' />
              </div>
            )}
          </div>
        ) : (
          <div className='border-default-400 w-full rounded-2xl border py-2'>
            <h3 className='text-default-500 py-14 text-center'>
              아고라 검색 결과가 없습니다.
            </h3>
          </div>
        ))}
      {/* {data && */}
      {/*   (data.searchExhibitions.exhibitions.length > 0 ? ( */}
      {/*     <div className='border-default-400 w-full rounded-2xl border py-2'> */}
      {/*       <h3 className='mx-3 mb-2'>이벤트 검색 결과</h3> */}
      {/*       <div className='px-2'> */}
      {/*         {data.searchExhibitions.exhibitions.map((item) => ( */}
      {/*           <EventListItem event={item} key={item.id} /> */}
      {/*         ))} */}
      {/*       </div> */}
      {/*       {data.searchExhibitions.pageInfo.totalElements > 6 && ( */}
      {/*         <div className='hover:bg-default-100 mx-2 flex cursor-pointer items-center justify-start rounded-2xl px-3 py-2 transition'> */}
      {/*           <p> */}
      {/*             {data.searchExhibitions.pageInfo.totalElements}개의 이벤트 */}
      {/*             검색결과 더보기 */}
      {/*           </p> */}
      {/*           <MdArrowForwardIos className='ml-1 inline' /> */}
      {/*         </div> */}
      {/*       )} */}
      {/*     </div> */}
      {/*   ) : ( */}
      {/*     <div className='border-default-400 w-full rounded-2xl border py-2'> */}
      {/*       <h3 className='text-default-500 py-14 text-center'> */}
      {/*         이벤트 검색 결과가 없습니다. */}
      {/*       </h3> */}
      {/*     </div> */}
      {/*   ))} */}
    </div>
  );
}
