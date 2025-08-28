import { pageInfoType } from "./default";

export type LocationType = {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  name: string;
  englishName?: string;
  phoneNumber?: string;
  websiteUrl?: string;
  snsUrl?: string;
  authorId?: string;
  authorUsername?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LocationSearchItemType = {
  locationId: string;
  name: string;
  englishName?: string;
  address: string;
};

export type LocationCreateRequestType = {
  latitude: number;
  longitude: number;
  address: string;
  name: string;
  regionName?: string;
  phoneNumber?: string;
  websiteUrl?: string;
  snsUrl?: string;
};

export type LocationUpdateRequestType = Partial<LocationCreateRequestType>;

export type LocationSearchParamsType = {
  keyword?: string;
  page?: number;
  size?: number;
};

export type LocationSearchResponseType = {
  locations: LocationSearchItemType[];
  pageInfo: pageInfoType;
};
