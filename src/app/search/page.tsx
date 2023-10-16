'use client';

import { Divider, Input, Link, Pagination } from '@nextui-org/react';
import { useDebounce, useDidUpdate } from '@toss/react';
import React, { useCallback, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

import jxios from '@/utils/jxios';

import { ArtworkSearchApiResponseType } from '@/types/artwork';

export default function Search() {
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState(1);
  const [data, setData] = useState<ArtworkSearchApiResponseType>();
  const handleSearch = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== '' || e.target.value !== search) {
      setSearch(e.target.value);
    }
  }, 200);
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

  useDidUpdate(() => {
    fetchSearch();
  }, [search, pagination, fetchSearch]);

  return (
    <div className='container mx-auto my-12 flex max-w-2xl flex-col items-center justify-center px-3'>
      <Input
        label='예술을 검색하세요'
        variant='bordered'
        type='search'
        size='lg'
        labelPlacement='outside'
        onChange={handleSearch}
        startContent={<AiOutlineSearch className='h-5 w-5' />}
        autoFocus
      />
      {data &&
        (data.artworks.length > 0 ? (
          <>
            <div className='flex w-full flex-col py-4'>
              {data &&
                data.artworks.length > 0 &&
                data.artworks.map((item) => (
                  <>
                    <Link
                      href={'/artwork/' + item.id}
                      className='rounded px-2 transition-colors duration-200 hover:bg-default-100 hover:no-underline'
                    >
                      <h4
                        className='py-3.5 font-normal text-default-800'
                        key={item.id}
                      >
                        {item.title} - {item.authorName}
                      </h4>
                    </Link>
                    <Divider />
                  </>
                ))}
            </div>
            <Pagination
              total={data.pageInfo.totalPages}
              onChange={setPagination}
            />
          </>
        ) : (
          <h3 className='py-14 text-default-500'>검색 결과가 없습니다.</h3>
        ))}
    </div>
  );
}
