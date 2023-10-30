'use client';

import { Kbd, Pagination } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

import ResponsiveGrid from '@/components/ResponsiveGrid';

import FeedListItemPost from '@/app/(list)/(feed)/FeedListItemPost';
import ArtworkItem from '@/app/(list)/artworks/ArtworkItem';
import jxios from '@/utils/jxios';

import { searchType } from '@/types/search';

export default function Search() {
  const [search, setSearch] = useState('');
  const [_a, setPaginationArtwork] = useState(1);
  const [_b, setPaginationPost] = useState(1);
  const [data, setData] = useState<searchType>();
  const searchParams = useSearchParams();
  const searchKeyword = searchParams.get('c');

  const fetchSearch = async () =>
    await jxios
      .get('/api/search', {
        params: {
          keyword: search,
          size: 3,
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
      <div className='flex h-12 items-center justify-start border-y px-4'>
        검색 결과{' '}
        {data &&
          data?.searchPosts.posts.length + data?.searchArtworks.artworks.length}
        건을 찾았습니다.
      </div>
      <div className='p-3'>
        <h5>아트워크</h5>
        {data &&
          (data.searchArtworks.artworks.length > 0 ? (
            <div>
              <ResponsiveGrid>
                {data.searchArtworks &&
                  data.searchArtworks.artworks.length > 0 &&
                  data.searchArtworks.artworks.map((item) => (
                    <ArtworkItem
                      artwork={{ artwork: item, isLiked: false }}
                      key={item.id}
                    />
                  ))}
              </ResponsiveGrid>
              <Pagination
                total={data.searchArtworks.pageInfo.totalPages}
                onChange={setPaginationArtwork}
              />
            </div>
          ) : (
            <h3 className='py-14 text-default-500'>검색 결과가 없습니다.</h3>
          ))}
        <h5>게시글 검색 결과</h5>
        {data &&
          (data.searchPosts.posts.length > 0 ? (
            <>
              {data.searchPosts.posts.map((item) => (
                <FeedListItemPost feed={item} key={item.id} />
              ))}

              <Pagination
                total={data.searchPosts.pageInfo.totalPages}
                onChange={setPaginationPost}
              />
            </>
          ) : (
            <h3 className='py-14 text-default-500'>검색 결과가 없습니다.</h3>
          ))}
      </div>
    </div>
  );
}
