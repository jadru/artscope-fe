import { Metadata, ResolvingMetadata } from "next";

import { standardLabel } from "@/components/StandardLabel";

import jxios from "@/utils/jxios";

import { profileApiType } from "@/types/profile";
import { articleListType, PortfolioProjectType } from "@/types/article";
import serverApi from "@/utils/serverApi";

// Components
import HeroArtist from "./components/HeroArtist";
import FeaturedPortfolioGrid from "./components/FeaturedPortfolioGrid";
import ArtistAboutSection from "./components/ArtistAboutSection";
import HistoryTimeline from "./components/HistoryTimeline";
import ExternalLinksSection from "./components/ExternalLinksSection";
import AllWorksSection from "./components/AllWorksSection";

const fetchProfile = async (id: string) => {
  return await serverApi.get<profileApiType>(`/api/server/members/${id}`);
};

const fetchFeaturedWorks = async (username: string) => {
  return await jxios
    .get("/api/server/magazines/members/" + username, {
      params: {
        page: 0,
        size: 6,
      },
    })
    .then((res) => res.data as articleListType);
};

// Keywords 추출 (introduction에서 키워드 추출)
function extractKeywords(introduction?: string): string[] {
  if (!introduction) return [];

  // 간단한 키워드 추출 로직
  const keywords: string[] = [];

  if (introduction.includes("설치")) keywords.push("설치미술");
  if (introduction.includes("영상") || introduction.includes("비디오"))
    keywords.push("영상");
  if (introduction.includes("사진") || introduction.includes("photography"))
    keywords.push("사진");
  if (introduction.includes("회화") || introduction.includes("painting"))
    keywords.push("회화");
  if (introduction.includes("조각") || introduction.includes("sculpture"))
    keywords.push("조각");
  if (introduction.includes("미디어")) keywords.push("뉴미디어");
  if (introduction.includes("퍼포먼스")) keywords.push("퍼포먼스");
  if (introduction.includes("드로잉")) keywords.push("드로잉");

  return keywords;
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  if (!id) throw new Error("id is required");

  const profile = await fetchProfile(id);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${standardLabel(profile.name)} - Artscope Portfolio`,
    description: standardLabel(profile.introduction).slice(0, 160),
    openGraph: {
      images: [profile.picture, ...previousImages],
      title: `${standardLabel(profile.name)} - Artscope Portfolio`,
      description: standardLabel(profile.introduction).slice(0, 160),
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

  // Fetch featured works (최신 6개)
  let featuredWorks: PortfolioProjectType[] = [];
  try {
    const worksData = await fetchFeaturedWorks(profile.username);
    featuredWorks = worksData.magazines.map((article) => ({
      ...article,
      isFeatured: true,
    }));
  } catch (error) {
    console.error("Failed to fetch featured works:", error);
  }

  // Extract keywords
  const keywords = extractKeywords(profile.introduction);

  // Featured images (작품의 첫 이미지들)
  const featuredImages = featuredWorks
    .slice(0, 3)
    .map((work) => work.mediaUrls[0])
    .filter(Boolean);

  // Fallback to profile picture if no featured images
  const heroImages =
    featuredImages.length > 0
      ? featuredImages
      : [profile.picture || "prod/images/default.jpg"];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900/50">
      {/* Hero Section */}
      <HeroArtist
        name={standardLabel(profile.name)}
        tagline={profile.introduction}
        featuredImages={heroImages}
        snsUrl={profile.snsUrl}
        websiteUrl={profile.websiteUrl}
      />

      {/* Featured Portfolio Grid */}
      {featuredWorks.length > 0 && (
        <FeaturedPortfolioGrid
          projects={featuredWorks}
          title="Featured Works"
        />
      )}

      {/* Artist About Section */}
      <ArtistAboutSection
        shortBio={profile.introduction}
        keywords={keywords}
        longBio={undefined}
      />

      {/* Exhibition & Career Timeline */}
      <HistoryTimeline history={profile.history} />

      {/* All Works Section */}
      <AllWorksSection username={profile.username} />

      {/* External Links */}
      <ExternalLinksSection
        websiteUrl={profile.websiteUrl}
        snsUrl={profile.snsUrl}
        artistName={standardLabel(profile.name)}
      />
    </main>
  );
}
