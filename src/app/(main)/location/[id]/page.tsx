import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

import { standardLabel } from "@/components/shared/StandardLabel";
import serverApi from "@/utils/serverApi";
import { LocationType } from "@/types/location";

const fetchLocation = async (id: string) => {
  return await serverApi.get<LocationType>(`/api/server/location/${id}`);
};

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  const location = await fetchLocation(id);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${standardLabel(location.name)} 스페이스 - Artscope`,
    description: standardLabel(location.address).slice(0, 60),
    openGraph: {
      images: previousImages,
      title: `${standardLabel(location.name)} 스페이스 - Artscope`,
      description: standardLabel(location.address).slice(0, 60),
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
  const location = await fetchLocation(id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">{standardLabel(location.name)}</h1>
        <div className="text-sm text-gray-500">
          {location.authorUsername && <span>@{location.authorUsername}</span>}
        </div>
      </div>

      <div className="space-y-2 text-gray-700">
        <div>
          <span className="font-medium">주소</span>{" "}
          {standardLabel(location.address)}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium">위도</span> {location.latitude}
          </div>
          <div>
            <span className="font-medium">경도</span> {location.longitude}
          </div>
        </div>
        {location.englishName && (
          <div>
            <span className="font-medium">영어 이름</span>{" "}
            {standardLabel(location.englishName)}
          </div>
        )}
        {location.phoneNumber && (
          <div>
            <span className="font-medium">전화</span>{" "}
            {standardLabel(location.phoneNumber)}
          </div>
        )}
        {location.websiteUrl && (
          <div>
            <span className="font-medium">웹사이트</span> {location.websiteUrl}
          </div>
        )}
        {location.snsUrl && (
          <div>
            <span className="font-medium">SNS</span> {location.snsUrl}
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-2">
        {location.authorUsername && (
          <Link
            href={`/location/${id}/edit`}
            className="text-sm text-gray-700 underline"
          >
            수정하기
          </Link>
        )}
        <Link href={`/location`} className="text-sm text-gray-700 underline">
          목록으로
        </Link>
      </div>
    </div>
  );
}
