import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

export interface ArtworkListParams {
  page: number;
  size: number;
}
const artworkList = (params: ArtworkListParams) =>
  jxios.get('/api/artworks', { params: params });

const artworkDelete = (id: number) => jxios.delete(`/api/artworks/${id}`);

const artworkDetail = (id: string) =>
  jxios.get(`${NEXT_PUBLIC_API_URL}/api/artworks/${id}`);

const likeMembers = (id: string) =>
  jxios.get(`${NEXT_PUBLIC_API_URL}/api/artworks/${id}/likes`);
const likeMembersAndArtworks = (id: number) =>
  jxios.get(`/api/artworks/${id}/member/likes`);
const likeArtwork = (id: number) => jxios.post(`/api/artworks/${id}/like`);
const artworkSearch = (keyword: string, page?: ArtworkListParams) =>
  jxios.get(`/api/artworks/search`, { params: { keyword, ...page } });
export const artwork = {
  list: artworkList,
  delete: artworkDelete,
  detail: artworkDetail,
  likeMembers: likeMembers,
  isLike: likeMembersAndArtworks,
  like: likeArtwork,
  search: artworkSearch,
};
