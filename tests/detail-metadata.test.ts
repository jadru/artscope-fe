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
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
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

  it("article fallback also carries og:title", async () => {
    api.magazine.mockRejectedValue(new Error("backend down"));
    const { generateMetadata } = await import("@/app/(main)/article/[id]/page");
    const meta = await generateMetadata({ params: Promise.resolve({ id: "7" }) }, parent);
    expect((meta.openGraph as { title?: string }).title).toBe("작품");
  });

  it("AS-17 profile: API failure still returns a default title, canonical and og:url", async () => {
    api.serverGet.mockRejectedValue(new Error("502 Bad Gateway"));
    const { generateMetadata } = await import("@/app/(main)/profile/[id]/page");
    const meta = await generateMetadata({ params: Promise.resolve({ id: "lee" }) }, parent);
    expect(meta.title).toBe("아티스트 프로필");
    expect(meta.alternates?.canonical).toBe(`${CANON}/profile/lee`);
    expect(meta.openGraph).toMatchObject({ url: `${CANON}/profile/lee`, title: "아티스트 프로필", siteName: "Artscope" });
  });

  it("AS-17 team: API failure still returns a default title, canonical and og:url", async () => {
    api.jxiosGet.mockRejectedValue(new Error("timeout"));
    const { generateMetadata } = await import("@/app/(main)/team/[id]/page");
    const meta = await generateMetadata({ params: Promise.resolve({ id: "9" }) }, parent);
    expect(meta.title).toBe("팀");
    expect(meta.alternates?.canonical).toBe(`${CANON}/team/9`);
    expect(meta.openGraph).toMatchObject({ url: `${CANON}/team/9`, title: "팀", siteName: "Artscope" });
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

// AS-18: transient failure → noindex metadata + page throws to the error boundary;
// API 404 / empty body → notFound() for both metadata and page.
const pages = [
  { kind: "article", mod: "@/app/(main)/article/[id]/page", title: "작품", fail: (e: unknown) => api.magazine.mockRejectedValue(e), ok: (v: unknown) => api.magazine.mockResolvedValue(v) },
  { kind: "profile", mod: "@/app/(main)/profile/[id]/page", title: "아티스트 프로필", fail: (e: unknown) => api.serverGet.mockRejectedValue(e), ok: (v: unknown) => api.serverGet.mockResolvedValue(v) },
  { kind: "team", mod: "@/app/(main)/team/[id]/page", title: "팀", fail: (e: unknown) => api.jxiosGet.mockRejectedValue(e), ok: (v: unknown) => api.jxiosGet.mockResolvedValue({ data: v }) },
] as const;

const serverError = (status: number) => Object.assign(new Error(`HTTP ${status}`), { status });
const axiosError = (status: number) => Object.assign(new Error(`HTTP ${status}`), { response: { status } });
const statusError = (kind: string, status: number) => (kind === "team" ? axiosError(status) : serverError(status));

describe("AS-18 failure handling", () => {
  for (const p of pages) {
    describe(p.kind, () => {
      it.each([
        ["network error", () => new TypeError("fetch failed")],
        ["timeout", () => Object.assign(new Error("timeout of 10000ms exceeded"), { code: "ECONNABORTED" })],
        ["HTTP 503", () => statusError(p.kind, 503)],
        ["HTTP 500", () => statusError(p.kind, 500)],
      ])("%s → default title + canonical + noindex", async (_label, make) => {
        p.fail(make());
        const { generateMetadata } = await import(p.mod);
        const meta = await generateMetadata({ params: Promise.resolve({ id: "5" }) }, parent);
        expect(meta.title).toBe(p.title);
        expect(meta.alternates?.canonical).toBe(`${CANON}/${p.kind}/5`);
        expect(meta.openGraph).toMatchObject({ url: `${CANON}/${p.kind}/5`, title: p.title });
        expect(meta.robots).toEqual({ index: false, follow: false, googleBot: { index: false, follow: false } });
      });

      it("transient failure → page throws to the error boundary (not a 200 placeholder)", async () => {
        p.fail(statusError(p.kind, 502));
        const { default: Page } = await import(p.mod);
        await expect(Page({ params: Promise.resolve({ id: "5" }) })).rejects.toMatchObject({ name: "DetailUnavailableError" });
      });

      it.each([
        ["API 404", () => p.fail(statusError(p.kind, 404))],
        ["API 410", () => p.fail(statusError(p.kind, 410))],
        ["empty body", () => p.ok("")],
        ["empty object", () => p.ok({})],
      ])("%s → notFound() in metadata and page", async (_label, arrange) => {
        arrange();
        const { generateMetadata, default: Page } = await import(p.mod);
        await expect(generateMetadata({ params: Promise.resolve({ id: "5" }) }, parent)).rejects.toThrow("NEXT_NOT_FOUND");
        await expect(Page({ params: Promise.resolve({ id: "5" }) })).rejects.toThrow("NEXT_NOT_FOUND");
      });

      it("success → indexable (no robots override)", async () => {
        p.ok(p.kind === "article"
          ? { id: 5, title: "t", content: "c", mediaUrls: [], author: { authorName: "a" } }
          : { name: "n", introduction: "", description: "", picture: "", profileImage: "", username: "u" });
        const { generateMetadata } = await import(p.mod);
        const meta = await generateMetadata({ params: Promise.resolve({ id: "5" }) }, parent);
        expect(meta.robots).toBeUndefined();
      });
    });
  }
});
