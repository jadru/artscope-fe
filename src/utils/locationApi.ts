import jxios from "@/utils/jxios";
import {
  LocationCreateRequestType,
  LocationSearchParamsType,
  LocationSearchResponseType,
  LocationType,
  LocationUpdateRequestType,
} from "@/types/location";

export const locationApi = {
  search: async (
    params?: LocationSearchParamsType
  ): Promise<LocationSearchResponseType> => {
    const res = await jxios.get("/api/server/location/search", { params });
    return res.data as LocationSearchResponseType;
  },
  getById: async (id: string): Promise<LocationType> => {
    const res = await jxios.get(`/api/server/location/${id}`);
    return res.data as LocationType;
  },
  create: async (data: LocationCreateRequestType): Promise<string> => {
    const res = await jxios.post("/api/server/location", data);
    return res.data as string;
  },
  update: async (
    id: string,
    data: LocationUpdateRequestType
  ): Promise<string> => {
    const res = await jxios.put(`/api/server/location/${id}`, data);
    return res.data as string;
  },
};
