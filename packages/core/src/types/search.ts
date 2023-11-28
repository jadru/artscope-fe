import { ArtworkSearchApiResponseType } from '@/types/artwork';
import { pageInfoType } from '@/types/default';
import { feedItemType } from '@/types/feed';

export type searchType = {
  searchArtworks: ArtworkSearchApiResponseType;
  searchPosts: { posts: feedItemType[]; pageInfo: pageInfoType };
};
