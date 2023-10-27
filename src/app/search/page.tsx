'use client';

import { Button, Input, Pagination } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

import RootLayout from '@/components/RootLayout';

import FeedListItemPost from '@/app/(feed)/FeedListItemPost';
import ArtworkItem from '@/app/artworks/ArtworkItem';
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
          page: 0,
          size: 6,
          sortDirection: 'DESC',
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
    <RootLayout className='items-center justify-center gap-2 px-3 py-4'>
      <Input
        label='예술을 검색하세요'
        variant='bordered'
        type='search'
        value={search}
        size='lg'
        labelPlacement='outside'
        onValueChange={setSearch}
        startContent={<AiOutlineSearch className='h-5 w-5' />}
        endContent={<Button onClick={fetchSearch}>검색</Button>}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            fetchSearch();
          }
        }}
        autoFocus={!searchKeyword}
      />
      <h5>작품 검색 결과</h5>
      {data &&
        (data.searchArtworks.artworks.length > 0 ? (
          <>
            <div className='flex flex-wrap'>
              {data.searchArtworks &&
                data.searchArtworks.artworks.length > 0 &&
                data.searchArtworks.artworks.map((item) => (
                  <ArtworkItem
                    artwork={{ artwork: item, isLiked: false }}
                    key={item.id}
                  />
                ))}
            </div>
            <Pagination
              total={data.searchArtworks.pageInfo.totalPages}
              onChange={setPaginationArtwork}
            />
          </>
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
    </RootLayout>
  );
}
