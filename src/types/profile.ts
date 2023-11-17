import { roleType } from '@/types/auth';

export type roleStatus =
  | 'NONE'
  | 'ARTIST_REJECTED'
  | 'ARTIST_PENDING'
  | 'ARTIST'
  | 'CURATOR_REJECTED'
  | 'CURATOR_PENDING'
  | 'CURATOR'
  | 'ADMIN';

export type profileApiType = {
  username: string;
  name: string;
  email: string;
  picture: string;
  oauthProvider: null | 'google' | 'naver';
  roleStatus: roleStatus;
  snsUrl: string;
  websiteUrl: string | null;
  introduction: string | null;
  history: string | null;
  companyName: string | null;
  companyRole: string | null;
  authrities: roleType;
  createdTime: Date;
  updatedTime: Date | null;
};

export type profileApiResponseType = {
  roleStatus: roleStatus;
  createdTime: Date;
  email: string;
  oauthProvider: null | 'google' | 'naver';
  history: string;
  introduction: string;
  activated: boolean;
  name: string;
  picture?: string | null;
  snsUrl: string;
  companyName?: string;
  companyRole?: string;
  username: string;
  websiteUrl?: string;
};
