import { AxiosRequestConfig } from 'axios';

import jxios from '@/utils/jxios';

import { ArtWorkApiResponseType } from '@/types';

export interface ArtworkListParams {
  page: number;
  size: number;
}
const artworkList = async (
  params: ArtworkListParams,
  config?: AxiosRequestConfig
): Promise<ArtWorkApiResponseType> => {
  return jxios.get('/api/artworks', { params: params, ...config });
};

export const artwork = {
  list: artworkList,
};
