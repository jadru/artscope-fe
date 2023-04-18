import { GetServerSidePropsContext } from 'next';
import { getServerSideSitemap } from 'next-sitemap';

import { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_ROOT_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { ArtWorkApiResponseType } from '@/types';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const apiResponse = await jxios.get(NEXT_PUBLIC_API_URL + '/api/artworks', {
    params: {
      page: 0,
      size: 1000,
    },
  });

  const data: ArtWorkApiResponseType = apiResponse.data;

  const artworks = data.artworks.map((artwork) => ({
    loc: NEXT_PUBLIC_ROOT_URL + '/artwork/' + artwork.id,
    lastmod: new Date(
      artwork.updatedTime ? artwork.updatedTime : artwork.createdTime
    ).toISOString(),
    changeFreq: 'daily',
  }));
  return getServerSideSitemap(ctx, artworks);
};
const Sitemap = () => {
  return;
};

export default Sitemap;
