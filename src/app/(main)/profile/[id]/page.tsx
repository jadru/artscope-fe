import { Metadata, ResolvingMetadata } from "next";

import ProfileComponent from "@/components/Profile";
import { standardLabel } from "@/components/StandardLabel";

import MembersArticleList from "@/app/(main)/profile/[id]/article-list";
import { NEXT_PUBLIC_API_URL } from "@/constant/env";
import jxios from "@/utils/jxios";

import { profileApiType } from "@/types/profile";
import serverApi from "@/utils/serverApi";
import ASNextImage from "@/components/ASNextImage";

const fetchProfile = async (id: string) => {
  return await serverApi.get<profileApiType>(`/api/server/members/${id}`);
};

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  if (!id) throw new Error("id is required");

  const profile = await fetchProfile(id);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${standardLabel(profile.name)} 작가 - Artscope`,
    description: standardLabel(profile.introduction).slice(0, 40),
    openGraph: {
      images: [profile.picture, ...previousImages],
      title: `${standardLabel(profile.name)} 작가 - Artscope`,
      description: standardLabel(profile.introduction).slice(0, 40),
      siteName: "Artscope",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await fetchProfile(id);
  const historyArray = profile.history?.split("\n\n");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* 프로필 이미지 */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <ASNextImage
                    width={128}
                    height={128}
                    src={profile.picture ?? "prod/images/default.jpg"}
                    alt={`${standardLabel(profile.name)} 프로필`}
                    className="w-32 h-32 rounded-2xl object-cover shadow-lg ring-4 ring-white"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 프로필 정보 */}
              <div className="flex-1 min-w-0">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {standardLabel(profile.name)}
                    </h1>
                    <p className="text-lg text-gray-600 font-medium">
                      @{profile.username}
                    </p>
                  </div>

                  {profile.introduction && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <p className="text-gray-700 leading-relaxed">
                        {standardLabel(profile.introduction)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 그리드 - 비율 조정 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* 왼쪽 컬럼 - 이력 정보 (2/5) */}
          <div className="lg:col-span-2 space-y-6">
            {historyArray && historyArray.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    작가 이력
                  </h2>
                </div>

                <div className="space-y-6">
                  {historyArray.map((history, historyIndex) => (
                    <div
                      key={historyIndex}
                      className="relative pl-6 border-l-2 border-gray-200"
                    >
                      <div className="absolute -left-1.5 top-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="space-y-3">
                        {history.split("\n").map((line, lineIndex) => (
                          <p
                            key={lineIndex}
                            className="text-gray-700 leading-relaxed text-sm"
                          >
                            {standardLabel(line)}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 오른쪽 컬럼 - 아티클 목록 (3/5) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  작성한 아티클
                </h2>
              </div>

              <MembersArticleList username={profile.username} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
