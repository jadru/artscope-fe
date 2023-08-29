import { FeedType } from '@/app/new/FeedList';

export const mockupData: FeedType = Array(100)
  .fill(0)
  .map((_, i) => ({
    id: i,
    type:
      i % 4 === 0
        ? 'artwork'
        : i % 4 === 1 || i % 4 === 3
        ? 'post'
        : 'exhibition',
    title:
      i % 4 === 0
        ? '태양을 따라서 달리는 말'
        : i % 4 === 1 || i % 4 === 3
        ? '어쩌고 하십니까?'
        : '어떤 서울 전시',
    content:
      '내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용' +
      '내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용' +
      '내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용' +
      i,
    thumbnail:
      i % 3 === 0
        ? 'https://avatars.githubusercontent.com/u/49296277?v=4'
        : undefined,
    authorName: '작가' + i,
    authorId: 'author000' + i,
    authorDescription:
      i % 2 === 0 ? '어떤 일을 하는 작가입니다.' + i : undefined,
    authorProfileImage: 'https://i.pravatar.cc/400?img=' + i,
    likeCount: i,
    saveCount: i % 2,
    viewCount: i * 3,
    commentCount: i,
    createdAt: '2021-' + i,
    updatedAt: i % 2 === 0 ? '2021-' + i : undefined,
  }));
