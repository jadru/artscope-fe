import { getServerSideSitemap } from 'next-sitemap';

import { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_ROOT_URL } from '@/constant/env';

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // 24시간을 초 단위로 표현

export async function GET(_request: Request) {
  // Method to source urls from cms
  const data: string[] = await fetch(
    NEXT_PUBLIC_API_URL + '/api/members/username',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
      },
    }
  ).then((res) => res.json());

  return getServerSideSitemap(
    data.map((members) => ({
      loc: `${NEXT_PUBLIC_ROOT_URL}/profile/${members}`,
      changefreq: 'daily',
      priority: 0.9,
    }))
  );
}
