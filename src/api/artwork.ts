import { AxiosRequestConfig } from 'axios';

import { get } from '@/api/base';

import { ArtWorkApiResponseType } from '@/types';

export interface ArtworkListParams {
  page: number;
  size: number;
}
export const artworkList = async (
  params: ArtworkListParams,
  config?: AxiosRequestConfig
): Promise<ArtWorkApiResponseType> => {
  return get('/api/artworks', params, config);
};
