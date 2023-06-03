import jxios from '@/utils/jxios';

export interface ArtworkListParams {
  page: number;
  size: number;
}
const artworkList = (params: ArtworkListParams) =>
  jxios.get('/api/artworks', { params: params });
export const artwork = {
  list: artworkList,
};
