import { pageInfoType } from '@/types/default';

export type LocationType = {
  address: string;
  englishName: string;
  latitude: number;
  longitude: number;
  link: string;
  name: string;
  phoneNumber: string;
  snsUrl: string;
  webSiteUrl: string;
};

export type LocationDataType = {
  locationId: number;
  address: string;
  englishName: string;
  latitude: number;
  longitude: number;
  name: string;
  phoneNumber: string;
  snsUrl: string;
  webSiteUrl: string;
};

export type LocationListItemType = {
  locationId: number;
  name: string;
  englishName: string;
  address: string;
};

export type LocationResponseType = {
  locations: LocationListItemType[];
  pageInfo: pageInfoType;
};
