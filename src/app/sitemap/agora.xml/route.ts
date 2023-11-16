import { getServerSideSitemap } from 'next-sitemap';

import { NEXT_PUBLIC_API_URL } from '@/constant/env';

import { AgoraListType } from '@/types/agora';

export const dynamic = 'force-dynamic';
export const revalidate = 3600 * 24;

export async function GET(_request: Request) {
  // Method to source urls from cms
  const data: AgoraListType = await fetch(NEXT_PUBLIC_API_URL + '/api/agoras', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      query: JSON.stringify({
        page: 0,
        size: 1000,
      }),
    },
  }).then((res) => res.json());

  return getServerSideSitemap(
    data.agoras.map((agora) => ({
      loc: `${NEXT_PUBLIC_API_URL}/agora/${agora.id}`,
      changefreq: 'daily',
      priority: 0.9,
      lastmod: String(agora.updatedTime ?? agora.createdTime),
    }))
  );
}
