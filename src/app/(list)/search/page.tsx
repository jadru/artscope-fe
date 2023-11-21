'use client';

import { Kbd } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdArrowForwardIos } from 'react-icons/md';

import ResponsiveGrid from '@/components/ResponsiveGrid';

import ArtworkItem from '@/app/(list)/(feed)/artworks/ArtworkItem';
import FeedListItemPost from '@/app/(list)/(feed)/FeedListItem/FeedListItemPost';
import jxios from '@/utils/jxios';

import { searchType } from '@/types/search';

export default function Search() {
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState<string>('all');
  const [data, setData] = useState<searchType>();
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const initialSearchKeyword = searchParams.get('c');
  const initialSearchType = searchParams.get('type');

  useEffect(() => {
    if (initialSearchKeyword) {
      setSearch(initialSearchKeyword);
    }
  }, [initialSearchKeyword]);

  useEffect(() => {
    if (initialSearchType) {
      setSearchType(initialSearchType);
    }
  }, [initialSearchType]);

  const fetchSearch = useCallback(async () => {
    push(`/search?c=${search}&type=${searchType}`);
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
  }, [search, push, searchType]);

  useEffect(() => {
    if (search.length > 0) {
      fetchSearch();
    }
  }, [search, fetchSearch]);

  return (
    <div className='mb-2 flex flex-col items-center justify-center gap-2 px-2'>
      <div className='flex h-16 w-full items-center space-x-2 rounded-2xl border border-default-400 px-2.5 py-2'>
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
          autoFocus={!initialSearchKeyword}
          placeholder='예술을 검색하세요'
          className='inline h-full w-full border-0 bg-transparent text-2xl focus:border-0 focus:outline-none focus:ring-0'
        />
        <Kbd keys={['enter']} className='h-6'>
          Enter
        </Kbd>
      </div>
      {data &&
        (data.searchArtworks.artworks.length > 0 ? (
          <div className='w-full rounded-2xl border border-default-400 py-2'>
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
                <div className='mx-2 flex cursor-pointer items-center justify-start rounded-2xl px-3 py-2 transition hover:bg-default-100'>
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
          <div className='w-full rounded-2xl border border-default-400 py-2'>
            <h3 className='mx-3 mb-2'>포스트 검색 결과</h3>
            <div className='px-2'>
              {data.searchPosts.posts.map((item) => (
                <FeedListItemPost feed={item} key={item.id} />
              ))}
            </div>
            {data.searchPosts.pageInfo.totalElements > 6 && (
              <div className='mx-2 flex cursor-pointer items-center justify-start rounded-2xl px-3 py-2 transition hover:bg-default-100'>
                <p>
                  {data.searchPosts.pageInfo.totalElements}개의 포스트 검색결과
                  더보기
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
  );
}
