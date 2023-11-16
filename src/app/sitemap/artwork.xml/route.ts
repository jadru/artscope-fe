import { getServerSideSitemap } from 'next-sitemap';

import { NEXT_PUBLIC_API_URL } from '@/constant/env';

import { ArtWorkApiResponseType } from '@/types/artwork';

export const dynamic = 'force-dynamic';
export const revalidate = 3600 * 24;

export async function GET(_request: Request) {
  // Method to source urls from cms
  const data: ArtWorkApiResponseType = await fetch(
    NEXT_PUBLIC_API_URL + '/api/artworks?size=1000&page=0',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ).then((res) => res.json());

  return getServerSideSitemap(
    data.artworks.map((aw) => ({
      loc: `${NEXT_PUBLIC_API_URL}/artwork/${aw.artwork.id}`,
      changefreq: 'daily',
      priority: 0.9,
      lastmod: String(aw.artwork.updatedTime ?? aw.artwork.createdTime),
    }))
  );
}
