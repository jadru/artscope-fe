import { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { canonicalPageMetadata } from "@/lib/seo";
import { DetailUnavailableError, loadDetail, UNAVAILABLE_ROBOTS } from "@/lib/detail-load";

import ASNextImage from "@/components/shared/ASNextImage";
import StandardLabel, { standardLabel } from "@/components/shared/StandardLabel";

import { NEXT_PUBLIC_API_URL } from "@/constant/env";
import jxios from "@/utils/jxios";

import { TeamDetailType } from "@/types/team";

const fetchTeam = async (id: string) => {
  return await jxios
    .get(`/api/server/teams/${id}`)
    .then((res) => res.data as TeamDetailType);
};

// AS-18: 404/empty → notFound(); network/5xx/timeout → noindex metadata + error boundary.
// cache() shares one API call between generateMetadata and the page within a request.
const loadTeam = cache((id: string) => loadDetail(() => fetchTeam(id)));

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  if (!id) throw new Error("id is required");
  const page = canonicalPageMetadata(["team", id]);

  const loaded = await loadTeam(id);
  if (loaded.status === "not-found") notFound();
  if (loaded.status === "unavailable") {
    // AS-17 fallback stays; AS-18 keeps the placeholder out of search results.
    return {
      title: "팀",
      alternates: page.alternates,
      robots: UNAVAILABLE_ROBOTS,
      openGraph: { url: page.url, title: "팀", siteName: "Artscope" },
    };
  }
  const team = loaded.data;

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${standardLabel(team.name)} - Artscope`,
    description: standardLabel(team.description).slice(0, 40),
    alternates: page.alternates,
    openGraph: {
      url: page.url,
      images: [team.profileImage, ...previousImages],
      title: `${standardLabel(team.name)} - Artscope`,
      description: standardLabel(team.description).slice(0, 40),
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
  const loaded = await loadTeam(id);
  if (loaded.status === "not-found") notFound();
  if (loaded.status === "unavailable") throw new DetailUnavailableError("team", loaded.error);
  const team = loaded.data;
  return (
    <div className="py-3">
      <div className="container max-w-screen-md px-2.5 flex flex-col items-stretch gap-1 text-[#1A1A1A]">
        <div
          className={`
          flex flex-row items-center w-full justify-between transition-colors gap-2 p-6 h-48 text-[#1A1A1A] relative overflow-hidden
        }`}
        >
          <ASNextImage
            src={team.backgroundImage}
            alt="background-image"
            width="800"
            height="400"
            className="w-full object-cover absolute top-0 left-0 z-0"
          />
          <div className="w-full h-full bg-black opacity-50 absolute top-0 left-0 z-0" />
          <div className="ml-0.5 flex flex-col transition z-10 text-white">
            <p className="inline text-2xl font-bold">
              <StandardLabel label={team.name} />
            </p>
            <p className="text-default-500 line-clamp-1 text-lg">
              {team.address}
            </p>
          </div>
          <ASNextImage
            src={team.profileImage ?? "prod/images/default.jpg"}
            alt="프로필 사진"
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover z-10"
          />
        </div>
        {team.description && (
          <div className="p-6 text-xl">{standardLabel(team.description)}</div>
        )}
      </div>
    </div>
  );
}
