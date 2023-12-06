import { AgoraType } from '@/types/agora';
import { DetailedArtworkType } from '@/types/artwork';
import { pageInfoType } from '@/types/default';
import { SingleEventTypeOnList } from '@/types/event';
import { feedItemType } from '@/types/feed';

export type searchType = {
  searchArtworks: {
    artworks: DetailedArtworkType[];
    pageInfo: pageInfoType;
  };
  searchPosts: { posts: feedItemType[]; pageInfo: pageInfoType };
  searchExhibitions: {
    exhibitions: SingleEventTypeOnList[];
    pageInfo: pageInfoType;
  };
  searchAgoras: { agoras: AgoraType[]; pageInfo: pageInfoType };
  pageInfo: pageInfoType;
};
