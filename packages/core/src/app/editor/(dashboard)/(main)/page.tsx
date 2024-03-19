import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';

import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { articleListType } from '@/types/article';

const fetchPersonalArticles = async (username: string) =>
  jxios
    .get(NEXT_PUBLIC_API_URL + '/api/magazines/members/' + username)
    .then((res) => res.data as articleListType);

export default async function Component() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access-token');
  if (!accessToken) {
    return;
  }
  const decoded_token = jwtDecode(accessToken.value);
  const username = decoded_token.sub;
  if (!username) {
    return;
  }
  const data = await fetchPersonalArticles(username);

  return (
    <>
      <div className='grid gap-3 md:grid-cols-3 lg:grid-cols-4 min-h-full content-stretch h-56 pb-3'>
        {data &&
          data.magazines.map((article) => (
            <Link
              href={'/article/' + article.id}
              key={article.id}
              className='flex flex-col w-full'>
              <Card key={article.id} className='flex flex-col w-full h-full'>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0 w-full'>
                  <div className='flex flex-col overflow-hidden'>
                    <CardTitle className='text-base font-semibold w-full'>
                      {article.title}
                    </CardTitle>
                    <CardDescription className='text-sm w-full line-clamp-4'>
                      {article.content}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-2 text-sm'>
                    <p>
                      <strong>Author:</strong>
                      {article.author.authorUsername}
                    </p>
                    <p>
                      <strong>Published:</strong>
                      {article.createdTime}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
      <div className='flex items-center justify-center w-full mt-8'>
        <Pagination />
      </div>
    </>
  );
}
