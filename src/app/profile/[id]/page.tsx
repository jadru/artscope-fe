import { Metadata, ResolvingMetadata } from "next";

import ProfileComponent from "@/components/Profile";
import { standardLabel } from "@/components/StandardLabel";

import MembersArticleList from "@/app/profile/[id]/article-list";
import { NEXT_PUBLIC_API_URL } from "@/constant/env";
import jxios from "@/utils/jxios";

import { profileApiType } from "@/types/profile";

const fetchProfile = async (id: string) => {
  return await jxios
    .get(`${NEXT_PUBLIC_API_URL}/api/members/${id}`)
    .then((res) => res.data as profileApiType);
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
    <div className="py-3">
      <div className="mx-auto max-w-screen-lg px-2.5 flex flex-col items-stretch gap-3 text-[#1A1A1A]">
        <ProfileComponent
          clickable={false}
          username={profile.username}
          name={profile.name}
          picture={profile.picture}
        />
        {profile.introduction && (
          <div className="p-6 text-base bg-gray-100 rounded-lg font-bold text-gray-500">
            {standardLabel(profile.introduction)}
          </div>
        )}
        {historyArray && (
          <div className="text-base py-4 bg-gray-100 rounded-lg">
            {historyArray.map((history) => (
              <>
                {history.split("\n").map((line, index) => (
                  <p key={index} className="px-6 leading-6">
                    {standardLabel(line)}
                  </p>
                ))}
              </>
            ))}
          </div>
        )}
        <MembersArticleList username={profile.username} />
      </div>
    </div>
  );
}
