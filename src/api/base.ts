import { AxiosRequestConfig } from 'axios';

import { ArtworkListParams } from '@/api/artwork';
import jxios from '@/utils/jxios';

export const get = async <T>(
  url: string,
  params?: ArtworkListParams,
  settings?: AxiosRequestConfig
): Promise<T> => {
  const { data } = await jxios.get<T>(url, { params, ...settings });
  return data;
};

export const post = async <T>(
  url: string,
  data?: never,
  settings?: AxiosRequestConfig
): Promise<T> => {
  const { data: res } = await jxios.post<T>(url, data, settings);
  return res;
};

export const put = async <T>(
  url: string,
  data?: never,
  settings?: AxiosRequestConfig
): Promise<T> => {
  const { data: res } = await jxios.put<T>(url, data, settings);
  return res;
};

export const del = async <T>(url: string, data?: never): Promise<T> => {
  const { data: res } = await jxios.delete<T>(url, data);
  return res;
};
