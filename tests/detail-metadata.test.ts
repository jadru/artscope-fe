// AS-16: article, profile and team detail pages put their own path on https://artscope.jadru.com
// into canonical and og:url. The API clients are mocked; no network.
import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({
  magazine: vi.fn(),
  serverGet: vi.fn(),
  jxiosGet: vi.fn(),
}));

vi.mock("@/utils/serverApi", () => ({
  default: { get: api.serverGet },
  serverArticlesApi: { getMagazineById: api.magazine },
  isServerNotFound: () => false,
}));
vi.mock("@/utils/jxios", () => ({ default: { get: api.jxiosGet } }));
vi.mock("@/utils/mediaUrl", () => ({ normalizeMediaUrl: (u: string) => `https://media.example/${u}` }));
vi.mock("@/components/shared/StandardLabel", () => ({
  default: () => null,
  standardLabel: (v: unknown) => String(v ?? ""),
}));
vi.mock("@/components/shared/ASNextImage", () => ({ default: () => null }));
vi.mock("@/features/article/components/ArticleHeader", () => ({ default: () => null }));
vi.mock("@/features/article/components/ArticleContent", () => ({ default: () => null }));
vi.mock("@/features/article/components/SupportingWorks", () => ({ default: () => null }));
vi.mock("@/features/article/components/ArtistAuthorCard", () => ({ default: () => null }));

const parent = Promise.resolve({ openGraph: { images: [] } }) as never;
const CANON = "https://artscope.jadru.com";

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_ROOT_URL", "https://artscope.kr"); // must not leak into SEO URLs
});

describe("AS-16 detail page metadata", () => {
  it("article: canonical and og:url are /article/<id> on the canonical host", async () => {
    api.magazine.mockResolvedValue({ id: 42, title: "Title", content: "Body", mediaUrls: ["a.jpg"], author: { authorName: "Kim" } });
    const { generateMetadata } = await import("@/app/(main)/article/[id]/page");
    const meta = await generateMetadata({ params: Promise.resolve({ id: "42" }) }, parent);
    expect(api.magazine).toHaveBeenCalledWith("42");
    expect(meta.alternates?.canonical).toBe(`${CANON}/article/42`);
    expect((meta.openGraph as { url?: string }).url).toBe(`${CANON}/article/42`);
    expect(meta.title).toBe("Title - Kim");
  });

  it("article: the API-failure fallback still carries the canonical URL", async () => {
    api.magazine.mockRejectedValue(new Error("backend down"));
    const { generateMetadata } = await import("@/app/(main)/article/[id]/page");
    const meta = await generateMetadata({ params: Promise.resolve({ id: "7" }) }, parent);
    expect(meta.title).toBe("작품");
    expect(meta.alternates?.canonical).toBe(`${CANON}/article/7`);
    expect((meta.openGraph as { url?: string }).url).toBe(`${CANON}/article/7`);
  });

  it("profile: canonical and og:url are /profile/<id>, with the id URI-encoded", async () => {
    api.serverGet.mockResolvedValue({ name: "Lee", introduction: "intro", picture: "p.jpg", username: "lee" });
    const { generateMetadata } = await import("@/app/(main)/profile/[id]/page");
    const meta = await generateMetadata({ params: Promise.resolve({ id: "lee kim" }) }, parent);
    expect(api.serverGet).toHaveBeenCalledWith("/api/server/members/lee kim");
    expect(meta.alternates?.canonical).toBe(`${CANON}/profile/lee%20kim`);
    expect((meta.openGraph as { url?: string }).url).toBe(`${CANON}/profile/lee%20kim`);
  });

  it("team: canonical and og:url are /team/<id> on the canonical host", async () => {
    api.jxiosGet.mockResolvedValue({ data: { name: "Crew", description: "d", profileImage: "t.jpg" } });
    const { generateMetadata } = await import("@/app/(main)/team/[id]/page");
    const meta = await generateMetadata({ params: Promise.resolve({ id: "9" }) }, parent);
    expect(api.jxiosGet).toHaveBeenCalledWith("/api/server/teams/9");
    expect(meta.alternates?.canonical).toBe(`${CANON}/team/9`);
    expect((meta.openGraph as { url?: string }).url).toBe(`${CANON}/team/9`);
  });

  it("no detail page emits a non-canonical host", async () => {
    api.magazine.mockResolvedValue({ id: 1, title: "t", content: "c", mediaUrls: [], author: { authorName: "a" } });
    api.serverGet.mockResolvedValue({ name: "n", introduction: "", picture: "", username: "u" });
    api.jxiosGet.mockResolvedValue({ data: { name: "n", description: "", profileImage: "" } });
    for (const [mod, id] of [["@/app/(main)/article/[id]/page", "1"], ["@/app/(main)/profile/[id]/page", "u"], ["@/app/(main)/team/[id]/page", "1"]] as const) {
      const { generateMetadata } = await import(mod);
      const meta = await generateMetadata({ params: Promise.resolve({ id }) }, parent);
      const json = JSON.stringify({ c: meta.alternates?.canonical, u: (meta.openGraph as { url?: string }).url });
      expect(json).not.toMatch(/artscope\.kr|vercel\.app|localhost/);
    }
  });
});
