import { PostApiRequestType } from '@/types/feed';

export const initialPostSchema: PostApiRequestType = {
  dto: {
    content: '',
    medias: null,
    thumbnail: null,
  },
  mediaFiles: null,
  thumbnailFile: null,
};
