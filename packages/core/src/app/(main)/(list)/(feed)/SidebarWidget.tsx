'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { FiCompass, FiInstagram } from 'react-icons/fi';

import RecentAgoraWidget from '@/app/(main)/(list)/(feed)/RecentAgoraWidget';
import RecentArtworkWidget from '@/app/(main)/(list)/(feed)/RecentArtworkWidget';
import RecentPostWidget from '@/app/(main)/(list)/(feed)/RecentPostWidget';

export default function SidebarWidget() {
  const [topStyle, setTopStyle] = useState('3.5rem'); // 기본 top 값은 3.5rem
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const widgetHeight =
          containerRef.current.getBoundingClientRect().height;
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;
        const baseTop =
          parseFloat(getComputedStyle(document.documentElement).fontSize) * 3.5; // 3.5rem을 픽셀로 변환

        if (widgetHeight > viewportHeight) {
          // 컴포넌트가 화면보다 큰 경우
          const maxTopStyle = viewportHeight - widgetHeight;
          const newTopStyle = Math.min(
            baseTop,
            Math.max(maxTopStyle, baseTop - scrollY)
          );
          setTopStyle(`${newTopStyle}px`);
        }
        // 컴포넌트가 화면보다 작은 경우, top 값을 변경하지 않음 (3.5rem 유지)
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className='sticky w-full space-y-2 self-start pb-4 pt-0'
      style={{ top: topStyle }}>
      {!isMobile && (
        <>
          <RecentPostWidget />
          <RecentArtworkWidget />
          {/* <RecentEventWidget /> */}
          <RecentAgoraWidget />
        </>
      )}

    </div>
  );
}
