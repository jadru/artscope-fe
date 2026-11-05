"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Lightweight top progress bar for client-side navigations.
 * Prefer this over route loading.tsx: a Suspense loading shell flushes HTTP 200
 * before detail pages can set 404/500 (see AS-18 / AS-19 curl checks).
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathRef = useRef(pathname);

  useEffect(() => {
    if (pathname !== pathRef.current) {
      pathRef.current = pathname;
      setActive(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      setActive(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setActive(false), 15000);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!active) return null;

  return (
    <div
      role="progressbar"
      aria-label="페이지 이동 중"
      aria-busy="true"
      data-testid="as-nav-progress"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-1 bg-gray-200"
    >
      <div className="h-full w-2/3 animate-pulse bg-gray-900" />
    </div>
  );
}
