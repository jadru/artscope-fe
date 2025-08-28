"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  LocationCreateRequestType,
  LocationSearchParamsType,
  LocationSearchResponseType,
  LocationType,
  LocationUpdateRequestType,
} from "@/types/location";
import { locationApi } from "@/utils/locationApi";
import { useProfile } from "@/auth/use-profile";

const buildSearchKey = (params?: LocationSearchParamsType) => [
  "locations",
  "search",
  {
    keyword: params?.keyword ?? "",
    page: params?.page ?? 0,
    size: params?.size ?? 10,
  },
];

export const useSearchLocations = (params?: LocationSearchParamsType) => {
  return useQuery<LocationSearchResponseType>({
    queryKey: buildSearchKey(params),
    queryFn: () => locationApi.search(params),
    enabled: true,
    staleTime: 60 * 1000,
  });
};

export const useLocation = (id: string | undefined) => {
  return useQuery<LocationType>({
    queryKey: ["location", id],
    queryFn: () => locationApi.getById(id as string),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  const profile = useProfile();

  return useMutation({
    mutationFn: async (payload: LocationCreateRequestType) => {
      if (!profile.data) {
        throw new Error("로그인이 필요합니다.");
      }
      return await locationApi.create(payload);
    },
    onSuccess: () => {
      // 검색 결과 무효화
      queryClient.invalidateQueries({ queryKey: ["locations", "search"] });
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  const profile = useProfile();

  return useMutation({
    mutationFn: async (args: {
      id: string;
      data: LocationUpdateRequestType;
      authorUsername?: string;
    }) => {
      const { id, data, authorUsername } = args;
      if (!profile.data) {
        throw new Error("로그인이 필요합니다.");
      }
      if (authorUsername && profile.data.username !== authorUsername) {
        throw new Error("본인이 작성한 Location만 수정할 수 있습니다.");
      }
      return await locationApi.update(id, data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["location", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["locations", "search"] });
    },
  });
};
