import { roleType } from '@/types/auth';

export type profileApiType = {
  username: string;
  name: string;
  email: string;
  picture: string;
  oauthProvider: null | 'google' | 'naver';
  artistStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  snsUrl: string;
  websiteUrl: string;
  introduction: string;
  history: string;
  authrities: roleType;
  createdTime: Date;
  updatedTime: Date | null;
};

export type profileApiResponseType = {
  artistStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  createdTime: Date;
  email: string;
  oauthProvider: null | 'google' | 'naver';
  history: string;
  introduction: string;
  activated: boolean;
  name: string;
  picture: string;
  snsUrl: string;
  username: string;
  websiteUrl: string;
};

export type profileApiRequestType = {
  email?: string;
  history?: string;
  introduction?: string;
  name?: string;
  snsUrl?: string;
  websiteUrl?: string;
};
