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
      <div className="py-20 text-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Unable to load content
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.magazines.map((article) => (
              <ArticleCardWithActions key={article.id} article={article} />
            ))}
          </React.Fragment>
        ))}
      </div>
      <div ref={bottomRef} className="h-px" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-12">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-white" />
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

  const tabs: { key: TabKey; label: string; disabled?: boolean }[] = [
    { key: "explore", label: "Explore" },
    { key: "following", label: "Following", disabled: !isLoggedIn },
    { key: "latest", label: "Latest" },
  ];

  return (
    <section id="feed" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            Discover
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Curated works from artists you&apos;ll love
          </p>
        </div>

        {/* Tab Navigation */}
        <nav
          className="flex items-center gap-1"
          role="tablist"
          aria-label="Feed filter"
        >
          {tabs.map(({ key, label, disabled }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-neutral-900 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200",
                  disabled && "cursor-not-allowed opacity-40"
                )}
                role="tab"
                id={getTabId(key)}
                aria-controls={getPanelId(key)}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => {
                  if (disabled) {
                    router.push("/user/login");
                    return;
                  }
                  setActive(key);
                }}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-neutral-900 dark:bg-white" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
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
              <div className="py-20 text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Sign in to see works from artists you follow
                </p>
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
