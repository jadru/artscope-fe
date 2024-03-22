import { format } from 'date-fns';
import { getServerSideSitemap } from 'next-sitemap';

import { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_ROOT_URL } from '@/constant/env';

import { articleListType } from '@/types/article';

export const dynamic = 'force-dynamic';
export const revalidate = 3600 * 24;

export async function GET(_request: Request) {
  // Method to source urls from cms
  const data: articleListType = await fetch(
    NEXT_PUBLIC_API_URL + '/api/magazines?size=1000&page=0',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
      },
    }
  ).then((res) => res.json());

  return getServerSideSitemap(
    data.magazines.map((magazines) => ({
      loc: `${NEXT_PUBLIC_ROOT_URL}/article/${magazines.id}`,
      changefreq: 'daily',
      priority: 0.9,
      lastmod: format(
        new Date(magazines.updatedTime ?? magazines.createdTime),
        'yyyy-MM-dd'
      ),
    }))
  );
}
