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
  oauthProvider: undefined | 'google' | 'naver';
  roleStatus: roleStatus;
  snsUrl: string;
  websiteUrl: string | undefined;
  introduction: string | undefined;
  history: string | undefined;
  companyName: string | undefined;
  companyRole: string | undefined;
  authrities: roleType;
  createdTime: Date;
  updatedTime: Date | undefined;
};

export type profileApiResponseType = {
  roleStatus: roleStatus;
  createdTime: Date;
  email: string;
  oauthProvider: undefined | 'google' | 'naver';
  history: string;
  introduction: string;
  activated: boolean;
  name: string;
  isAdmin: boolean;
  picture?: string;
  snsUrl: string;
  companyName?: string;
  companyRole?: string;
  username: string;
  websiteUrl?: string;
};
