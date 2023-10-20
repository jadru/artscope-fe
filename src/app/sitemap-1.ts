import { MetadataRoute } from 'next';

import { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_ROOT_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { ArtworkType } from '@/types/artwork';

async function getArtworks() {
  const { data } = await jxios.get(NEXT_PUBLIC_API_URL + '/api/artworks', {
    params: {
      page: 0,
      size: 1000,
    },
  });

  return data;
}
export async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getArtworks();
  return data.artworks.map((aw: ArtworkType) => ({
    loc: NEXT_PUBLIC_ROOT_URL + '/artwork/' + aw.artwork.id,
    lastmod: new Date(
      aw.artwork.updatedTime ? aw.artwork.updatedTime : aw.artwork.createdTime
    ).toISOString(),
    changeFreq: 'daily',
  }));
}
