import { GetServerSidePropsContext } from 'next';
import { getServerSideSitemap } from 'next-sitemap';

import jxios from '@/utils/jxios';

import { ArtWorkApiResponseType } from '@/types';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const apiResponse = await jxios.get('/api/artworks', {
    params: {
      page: 0,
      size: 1000,
    },
  });

  const data: ArtWorkApiResponseType = apiResponse.data;

  const artworks = data.artworks.map((artwork) => ({
    loc: 'https://www.artscope.kr/artwork/' + artwork.id,
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
