'use client';

import { useQuery } from '@tanstack/react-query';
import { notFound, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import ArticleItem from '@/app/(main)/(list)/(main)/ArticleItem';
import Logo from '@/assets/images/logo_long.svg';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { articleListType } from '@/types/article';

const LIMIT = 16;

const fetchFeeds = async (page: number) =>
  await jxios
    .get('/api/magazines', {
      params: {
        page: page,
        size: LIMIT,
      },
    })
    .then((res) => res.data as articleListType);

export default function ArticleList() {
  const searchParams = useSearchParams();
  const { user, isLogin } = useUser();
  const pageParams = searchParams.get('page') || 0;
  const [page, setPage] = useState(Number(pageParams));
  const { data, isLoading, refetch, isSuccess, isError } = useQuery({
    queryKey: ['articleList'],
    queryFn: () => fetchFeeds(page),
  });

  useEffect(() => {
    refetch();
  }, [refetch, user, page]);

  useEffect(() => {
    if (isError) {
      notFound();
    }
  }, [isError]);

  return (
    <div>
      <Logo className='m-8 group-hover:fill-primary w-52 overflow-hidden fill-black transition duration-100 z-40' />
      {isLoading && (
        <div className='w-full'>
          <p>Loading...</p>
        </div>
      )}
      {isError && (
        <div className='w-full'>
          <h3 className='my-12 text-center'>에러가 발생했습니다.</h3>
        </div>
      )}
      {data && data.magazines.length === 0 && (
        <h3 className='my-12 text-center'>아직 작성된 글이 없습니다.</h3>
      )}
      {isSuccess && (
        <>
          <div className='container grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4'>
            {data?.magazines.map((article) => (
              <ArticleItem key={article.id} article={article} />
            ))}
          </div>
          <Pagination>
            <PaginationContent>
              {data?.pageInfo.page > 0 && (
                <>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(data?.pageInfo.page - 1)}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setPage(data?.pageInfo.page - 1)}>
                      {data?.pageInfo.page}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              <PaginationItem>
                <PaginationLink href='#' isActive>
                  {data?.pageInfo.page + 1}
                </PaginationLink>
              </PaginationItem>
              {data?.pageInfo.page < data?.pageInfo.totalPages - 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setPage(data?.pageInfo.page + 1)}>
                      {data?.pageInfo.page + 2}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(data?.pageInfo.page + 1)}
                    />
                  </PaginationItem>
                </>
              )}
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}
