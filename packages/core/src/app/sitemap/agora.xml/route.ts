import { format } from 'date-fns';
import { getServerSideSitemap } from 'next-sitemap';

import { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_ROOT_URL } from '@/constant/env';

import { AgoraListType } from '@/types/agora';

export const dynamic = 'force-dynamic';
export const revalidate = 3600 * 24;

export async function GET(_request: Request) {
  // Method to source urls from cms
  const data: AgoraListType = await fetch(
    NEXT_PUBLIC_API_URL + '/api/agoras?page=0&size=1000',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ).then((res) => res.json());

  return getServerSideSitemap(
    data.agoras.map((agora) => ({
      loc: `${NEXT_PUBLIC_ROOT_URL}/agora/${agora.id}`,
      changefreq: 'daily',
      priority: 0.9,
      lastmod: format(
        new Date(agora.updatedTime ?? agora.createdTime),
        'yyyy-MM-dd'
      ),
    }))
  );
}
