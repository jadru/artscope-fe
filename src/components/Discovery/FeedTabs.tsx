"use client";

import {
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import React, { useEffect, useMemo, useRef, useState, useId } from "react";
import { useRouter } from "next/navigation";

import { useObserver } from "@/hooks/useObserver";
import jxios from "@/utils/jxios";
import type { articleListType } from "@/types/article";
import ArticleCardWithActions from "@/components/Discovery/ArticleCardWithActions";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/auth/use-profile";
import { cn } from "@/utils";

const LIMIT = 30;

type TabKey = "explore" | "following" | "latest";

const fetchTrending = async ({ pageParam = 0 }) => {
  const res = await jxios.get("/api/server/magazines", {
    params: { page: pageParam, size: LIMIT },
  });
  return res.data as articleListType;
};

const fetchFollowing = async ({ pageParam = 0 }) => {
  const res = await jxios.get("/api/server/magazines/my/following/members", {
    params: { page: pageParam, size: LIMIT },
  });
  return res.data as articleListType;
};

const fetchLatest = async ({ pageParam = 0 }) => {
  const res = await jxios.get("/api/server/magazines", {
    params: { page: pageParam, size: LIMIT },
  });
  return res.data as articleListType;
};

function TabFeed({ tab }: { tab: TabKey }) {
  const queryClient = useQueryClient();
  const queryFn = useMemo(() => {
    switch (tab) {
      case "explore":
        return fetchTrending;
      case "following":
        return fetchFollowing;
      case "latest":
        return fetchLatest;
      default:
        return fetchTrending;
    }
  }, [tab]);

  const initialExplore =
    tab === "explore"
      ? (queryClient.getQueryData(["gallery", "trending", 0]) as
          | articleListType
          | undefined)
      : undefined;

  const { data, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["gallery", tab],
      queryFn,
      initialPageParam: 0,
      initialData: initialExplore
        ? { pages: [initialExplore], pageParams: [0] }
        : undefined,
      staleTime: 2 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.magazines.length < LIMIT) return undefined;
        return allPages.length;
      },
    });

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const onIntersect = ([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useObserver({ target: bottomRef, onIntersect });

  if (isError) {
    return (
      <div className="w-full py-12 text-center text-gray-500 dark:text-white/60">
        콘텐츠를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.magazines.map((article) => (
              <ArticleCardWithActions key={article.id} article={article} />
            ))}
          </React.Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
      {isFetchingNextPage && (
        <div className="w-full py-16 flex justify-center items-center text-white/70">
          <Loader2 className="animate-spin" />
        </div>
      )}
    </div>
  );
}

export default function FeedTabs() {
  const [active, setActive] = useState<TabKey>("explore");
  const router = useRouter();
  const { data: user } = useProfile();
  const isLoggedIn = !!user;
  const tabBaseId = useId();

  const getTabId = (key: TabKey) => `${tabBaseId}-${key}-tab`;
  const getPanelId = (key: TabKey) => `${tabBaseId}-${key}-panel`;

  useEffect(() => {
    if (active === "following" && !isLoggedIn) {
      setActive("explore");
    }
  }, [active, isLoggedIn]);

  const renderTabButton = (
    key: TabKey,
    label: string,
    options?: { disabled?: boolean }
  ) => {
    const isActive = active === key;
    return (
      <button
        key={key}
        className={cn(
          "rounded-full px-5 py-2 text-sm font-medium transition-all",
          isActive
            ? "bg-gray-900 text-white shadow dark:bg-white dark:text-black dark:shadow-lg dark:shadow-purple-900/40"
            : "text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white",
          options?.disabled && "cursor-not-allowed opacity-40"
        )}
        role="tab"
        id={getTabId(key)}
        aria-controls={getPanelId(key)}
        aria-selected={isActive}
        tabIndex={isActive ? 0 : -1}
        onClick={() => {
          if (options?.disabled) {
            router.push("/user/login");
            return;
          }
          setActive(key);
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <section id="feed" className="w-full space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-white/50">
            Daily Highlights
          </p>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Discovery Feed
          </h3>
          <p className="text-sm text-gray-600 dark:text-white/60">
            하루에도 여러 번 업데이트되는 작품과 작가 이야기를 이곳에서
            만나보세요.
          </p>
        </div>
        <div
          className="flex flex-wrap items-center gap-2 rounded-full border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] p-1 shadow-sm dark:shadow-white/5"
          role="tablist"
          aria-label="피드 정렬"
        >
          {renderTabButton("explore", "탐색")}
          {renderTabButton("following", "팔로잉", {
            disabled: !isLoggedIn,
          })}
          {renderTabButton("latest", "최신")}
        </div>
      </div>

      <div>
        <div
          id={getPanelId("explore")}
          role="tabpanel"
          aria-labelledby={getTabId("explore")}
          hidden={active !== "explore"}
        >
          {active === "explore" && <TabFeed tab="explore" />}
        </div>
        <div
          id={getPanelId("following")}
          role="tabpanel"
          aria-labelledby={getTabId("following")}
          hidden={active !== "following"}
        >
          {active === "following" &&
            (isLoggedIn ? (
              <TabFeed tab="following" />
            ) : (
              <div className="w-full rounded-3xl border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] py-16 text-center text-gray-500 dark:text-white/70">
                팔로잉 피드는 로그인 후 이용할 수 있습니다.
              </div>
            ))}
        </div>
        <div
          id={getPanelId("latest")}
          role="tabpanel"
          aria-labelledby={getTabId("latest")}
          hidden={active !== "latest"}
        >
          {active === "latest" && <TabFeed tab="latest" />}
        </div>
      </div>
    </section>
  );
}
