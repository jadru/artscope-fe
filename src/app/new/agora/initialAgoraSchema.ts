import { CreateAgoraType } from '@/types/agora';

export const initialAgoraSchema: CreateAgoraType = {
  dto: {
    title: '',
    content: '',
    isAnonymous: false,
    agreeText: '',
    naturalText: '',
    disagreeText: '',
    thumbnail: undefined,
    medias: [],
  },
  mediaFiles: [],
  thumbnailFile: undefined,
};
