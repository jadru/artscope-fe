'use client';

import { Input, Pagination } from '@nextui-org/react';
import { useDidUpdate } from '@toss/react';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

import ResponsiveGrid from '@/components/ResponsiveGrid';
import RootLayout from '@/components/RootLayout';

import ArtworkItem from '@/app/artworks/ArtworkItem';
import jxios from '@/utils/jxios';

import { ArtworkSearchApiResponseType } from '@/types/artwork';

export default function Search() {
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState(1);
  const [data, setData] = useState<ArtworkSearchApiResponseType>();
  const searchParams = useSearchParams();
  const searchKeyword = searchParams.get('c');

  const fetchSearch = useCallback(async () => {
    await jxios
      .get('/api/artworks/search', {
        params: {
          keyword: search,
          page: pagination - 1,
          size: 12,
          sortDirection: 'DESC',
        },
      })
      .then((res) => {
        setData(res.data);
      });
  }, [pagination, search]);

  useEffect(() => {
    if (searchKeyword) {
      setSearch(searchKeyword);
    }
  }, [searchKeyword]);

  useDidUpdate(() => {
    fetchSearch();
  }, [search, pagination, fetchSearch]);

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
        autoFocus
      />
      {data &&
        (data.artworks.length > 0 ? (
          <>
            <ResponsiveGrid>
              {data &&
                data.artworks.length > 0 &&
                data.artworks.map((item) => (
                  <ArtworkItem
                    artwork={{ artwork: item, isLike: false }}
                    key={item.id}
                  />
                ))}
            </ResponsiveGrid>
            <Pagination
              total={data.pageInfo.totalPages}
              onChange={setPagination}
            />
          </>
        ) : (
          <h3 className='py-14 text-default-500'>검색 결과가 없습니다.</h3>
        ))}
    </RootLayout>
  );
}
