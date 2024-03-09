'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { BiHeart } from 'react-icons/bi';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';

import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { articleListType } from '@/types/article';

const fetchPersonalArticles = async (username?: string) =>
  jxios
    .get('/api/magazines', {
      params: {
        username,
      },
    })
    .then((res) => res.data as articleListType);

export default function Component() {
  const { user, isLogin } = useUser();
  const { data, isLoading, refetch, isSuccess, isError } = useQuery({
    queryKey: ['personal_articles'],
    queryFn: () => fetchPersonalArticles(user?.username),
  });

  useEffect(() => {
    refetch();
  }, [refetch, user]);

  return (
    <>
      <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {isSuccess &&
          data.magazines.map((article) => (
            <Card key={article.id} className='flex flex-col w-full'>
              <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0 w-full'>
                <div className='flex flex-col overflow-hidden'>
                  <CardTitle className='text-base font-semibold w-full'>
                    {article.title}
                  </CardTitle>
                  <CardDescription className='text-sm w-full line-clamp-4'>
                    {article.content}
                  </CardDescription>
                </div>
                <Button className='rounded-full' size='icon' variant='ghost'>
                  <BiHeart className='w-4 h-4' />
                  <span className='sr-only'>Like</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className='grid gap-2 text-sm'>
                  <p>
                    <strong>Author:</strong>
                    {article.author.authorUsername}
                    {'\n                              '}
                  </p>
                  <p>
                    <strong>Published:</strong>
                    {article.createdTime}
                    {'\n                              '}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
      <div className='flex items-center justify-center w-full mt-8'>
        <Pagination />
      </div>
    </>
  );
}
