import { CommentType } from "@/types/comment";
import { pageInfoType } from "@/types/default";

export type articleListType = {
  magazines: articleItemType[];
  pageInfo: pageInfoType;
};

export type articleItemType = {
  id: number;
  title: string;
  content: string;
  mediaUrls: string[];
  categoryName: string;
  categoryId: number;
  categorySlug: string;
  views: number;
  likes: number;
  isLiked: boolean;
  comments: number;
  author: AuthorType;
  teamName: string | null;
  teamId: number | null;
  createdTime: string;
  updatedTime: string;
  magazineComments: CommentType[];
};

// 포트폴리오 프로젝트 타입
export type PortfolioProjectType = articleItemType & {
  shortDescription?: string; // 짧은 설명 (카드용)
  year?: number; // 작품 연도
  medium?: string; // 매체/기법
  dimensions?: string; // 크기
  isFeatured?: boolean; // 대표작 여부
  series?: string; // 시리즈명
};

export type AuthorType = {
  authorUsername: string;
  authorName: string;
  authorProfileImage: string;
  authorCompanyName: string;
  authorCompanyRole: string;
};

export type articleCategoryType = {
  id: number;
  name: string;
  description?: string;
  createdTime: string;
  updatedTime: string;
};
