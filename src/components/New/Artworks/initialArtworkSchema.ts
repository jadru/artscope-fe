import { ArtWorkApiRequestType } from '@/types/artwork';

export const initialArtWork: ArtWorkApiRequestType = {
  dto: {
    title: '',
    description: '',
    visible: true,
    tags: [],
    medias: [],
    thumbnail: { mediaType: 'image', description: '' },
  },
  mediaFiles: [],
  thumbnailFile: undefined,
};
