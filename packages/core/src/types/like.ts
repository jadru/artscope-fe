export type likeMemberApiResponseType = {
  memberUsernames: string[];
  likes: number;
  pageInfo: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
};

export type likeArtworksByMemberApiResponseType = {
  dtos: { artworkId: number; likedTime: Date }[];
  pageInfo: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
};
