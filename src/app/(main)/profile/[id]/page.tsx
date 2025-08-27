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
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* 프로필 헤더 */}
        <div className="border-b border-gray-200 pb-16 mb-16">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* 프로필 이미지 */}
            <div className="flex-shrink-0">
              <ASNextImage
                width={160}
                height={160}
                src={profile.picture ?? "prod/images/default.jpg"}
                alt={`${standardLabel(profile.name)} 프로필`}
                className="w-40 h-40 rounded-full object-cover"
              />
            </div>

            {/* 프로필 정보 */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-4xl font-light text-gray-900 mb-2">
                  {standardLabel(profile.name)}
                </h1>
                <p className="text-lg text-gray-600 font-light">
                  @{profile.username}
                </p>
              </div>

              {profile.introduction && (
                <div className="max-w-2xl">
                  <p className="text-gray-700 leading-relaxed font-light text-lg">
                    {standardLabel(profile.introduction)}
                  </p>
                </div>
              )}

              {/* 통계 */}
              <div className="flex gap-12">
                <div className="text-center">
                  <div className="text-2xl font-light text-gray-900">24</div>
                  <div className="text-sm text-gray-500">작품</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light text-gray-900">1.2k</div>
                  <div className="text-sm text-gray-500">팔로워</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light text-gray-900">98</div>
                  <div className="text-sm text-gray-500">좋아요</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* 왼쪽 컬럼 - 정보 */}
          <div className="lg:col-span-1 space-y-16">
            {/* 작가 이력 */}
            {historyArray && historyArray.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-8">이력</h2>
                <div className="space-y-6">
                  {historyArray.map((history, historyIndex) => (
                    <div key={historyIndex} className="space-y-2">
                      {history.split("\n").map((line, lineIndex) => (
                        <p
                          key={lineIndex}
                          className="text-gray-600 leading-relaxed font-light text-sm"
                        >
                          {standardLabel(line)}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 연락처 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6">연락처</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">@artistname</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    @artistportfolio
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 컬럼 - 작품 */}
          <div className="lg:col-span-3">
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-8">작품</h2>
              <MembersArticleList username={profile.username} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
