'use client';

import { Kbd } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdArrowForwardIos } from 'react-icons/md';

import ResponsiveGrid from '@/components/ResponsiveGrid';

import FeedListItemPost from '@/app/(list)/(feed)/FeedListItem/FeedListItemPost';
import ArtworkItem from '@/app/(list)/artworks/ArtworkItem';
import jxios from '@/utils/jxios';

import { searchType } from '@/types/search';

export default function Search() {
  const [search, setSearch] = useState('');
  const [data, setData] = useState<searchType>();
  const searchParams = useSearchParams();
  const searchKeyword = searchParams.get('c');

  const fetchSearch = async () =>
    await jxios
      .get('/api/search', {
        params: {
          keyword: search,
          size: 6,
        },
      })
      .then((res) => {
        setData(res.data);
      });
  useEffect(() => {
    fetchSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='items-center justify-center gap-2'>
      <div className='flex h-16 w-full items-center space-x-2 px-4'>
        <AiOutlineSearch className='inline' size={25} />
        <input
          type='search'
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchSearch();
            }
          }}
          autoFocus={!searchKeyword}
          placeholder='예술을 검색하세요'
          className='inline h-full w-full text-2xl'
        />
        <Kbd keys={['enter']} className='h-6'>
          Enter
        </Kbd>
      </div>
      <hr />
      <div>
        {data &&
          (data.searchArtworks.artworks.length > 0 ? (
            <div>
              <h3 className='mx-4 mb-1 mt-4'>아트워크 검색 결과</h3>
              <div className='md:mx-2'>
                <ResponsiveGrid>
                  {data.searchArtworks.artworks.map((item) => (
                    <ArtworkItem
                      artwork={{ artwork: item, isLiked: false }}
                      key={item.id}
                    />
                  ))}
                </ResponsiveGrid>
                {data.searchArtworks.pageInfo.totalElements > 6 && (
                  <div className='mx-4 mb-4 mt-3 flex cursor-pointer items-center justify-start rounded-2xl px-3 py-1 hover:bg-default-100'>
                    <p>
                      {data.searchArtworks.pageInfo.totalElements}개의 아트워크
                      검색결과 더보기
                    </p>
                    <MdArrowForwardIos className='ml-1 inline' />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <h3 className='py-14 text-center text-default-500'>
              아트워크 검색 결과가 없습니다.
            </h3>
          ))}

        {data &&
          (data.searchPosts.posts.length > 0 ? (
            <div className='border-t p-4'>
              <h3 className='mb-1'>포스트 검색 결과</h3>
              <div className='mt-1 border-x border-t md:border-x-0'>
                {data.searchPosts.posts.map((item) => (
                  <FeedListItemPost feed={item} key={item.id} />
                ))}
              </div>
              {data.searchPosts.pageInfo.totalElements > 6 && (
                <div className='mt-3 flex cursor-pointer items-center justify-start rounded-2xl px-3 py-1 hover:bg-default-100'>
                  <p>
                    {data.searchPosts.pageInfo.totalElements}개의 포스트
                    검색결과 더보기
                  </p>
                  <MdArrowForwardIos className='ml-1 inline' />
                </div>
              )}
            </div>
          ) : (
            <h3 className='border-y py-14 text-center text-default-500'>
              포스트 검색 결과가 없습니다.
            </h3>
          ))}
      </div>
    </div>
  );
}
