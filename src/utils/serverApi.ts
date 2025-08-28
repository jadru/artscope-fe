import { cookies } from "next/headers";
import { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_ROOT_URL } from "@/constant/env";

// 서버 컴포넌트에서 사용할 API 클라이언트
class ServerApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = NEXT_PUBLIC_ROOT_URL || "/api/server") {
    this.baseUrl = baseUrl;
  }

  // 쿠키에서 토큰 가져오기
  private async getTokenFromCookie(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("access-token")?.value || null;
  }

  // 공통 요청 메서드
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // 기본 헤더 설정
    const headers = new Headers(options.headers);

    // Content-Type이 설정되지 않은 경우 기본값 설정
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    // 쿠키에서 토큰 가져와서 Authorization 헤더 추가
    const accessToken = await this.getTokenFromCookie();
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // 응답이 JSON인지 확인
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        return (await response.text()) as T;
      }
    } catch (error) {
      console.error("서버 API 요청 실패:", error);
      throw error;
    }
  }

  // GET 요청
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }

    return this.request<T>(url);
  }

  // POST 요청
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 요청
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH 요청
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }
}

// 기본 서버 API 클라이언트 인스턴스
export const serverApi = new ServerApiClient();

// 특정 엔드포인트별 서버 API 클라이언트들
export const serverArticlesApi = {
  getAll: (params?: any) => serverApi.get("/api/server/magazines", params),
  getById: (id: string) => serverApi.get(`/api/server/magazines/${id}`),
  getMagazineById: (id: string) => serverApi.get(`/api/server/magazines/${id}`),
};

export const serverUsersApi = {
  getProfile: (id: string) => serverApi.get(`/api/server/users/${id}`),
  getArticles: (id: string, params?: any) =>
    serverApi.get(`/api/server/users/${id}/articles`, params),
};

export const serverTeamsApi = {
  getAll: (params?: any) => serverApi.get("/api/server/teams", params),
  getById: (id: string) => serverApi.get(`/api/server/teams/${id}`),
  getMembers: (id: string) => serverApi.get(`/api/server/teams/${id}/members`),
};

// Location APIs (검색/조회/생성/수정)
export const serverLocationsApi = {
  // GET /api/location/search?keyword=&page=&size=
  search: (params?: import("@/types/location").LocationSearchParamsType) =>
    serverApi.get<import("@/types/location").LocationSearchResponseType>(
      "/api/server/location/search",
      params
    ),
  // GET /api/location/{id}
  getById: (id: string) =>
    serverApi.get<import("@/types/location").LocationType>(
      `/api/server/location/${id}`
    ),
  // POST /api/location
  create: (data: import("@/types/location").LocationCreateRequestType) =>
    serverApi.post<string>("/api/server/location", data),
  // PUT /api/location/{id}
  update: (
    id: string,
    data: import("@/types/location").LocationUpdateRequestType
  ) => serverApi.put<string>(`/api/server/location/${id}`, data),
};

export default serverApi;
