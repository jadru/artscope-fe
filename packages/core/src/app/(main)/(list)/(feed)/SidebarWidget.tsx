'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { FiCompass, FiInstagram } from 'react-icons/fi';

import RecentAgoraWidget from '@/app/(main)/(list)/(feed)/RecentAgoraWidget';
import RecentArtworkWidget from '@/app/(main)/(list)/(feed)/RecentArtworkWidget';
import RecentEventWidget from '@/app/(main)/(list)/(feed)/RecentEventWidget';
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
      style={{ top: topStyle }}
    >
      {!isMobile && (
        <>
          <RecentPostWidget />
          <RecentArtworkWidget />
          <RecentEventWidget />
          <RecentAgoraWidget />
        </>
      )}
      <div className='space-y-0.5'>
        <div className='text-default-500 flex items-center justify-center gap-2'>
          <Link
            href='https://jadru.notion.site/Artscope-5d99f78df8c64d019bd21a02eb1f80d2?pvs=4'
            target='_blank'
            className='hover:text-primary text-[0.88rem]'
          >
            가이드
          </Link>
          <Link
            href='https://forms.gle/F9V9gppnKXXBRE4d6'
            target='_blank'
            className='hover:text-primary text-[0.88rem]'
          >
            피드백
          </Link>
          <Link
            href='https://www.plip.kr/pcc/1bdbcbd7-0bde-4101-8ce2-cc4e1fc53eef/privacy-policy'
            target='_blank'
            className='hover:text-primary text-[0.88rem]'
          >
            개인정보 처리방침
          </Link>
        </div>
        <div className='text-default-500 flex justify-center gap-1'>
          <Link
            href='https://www.instagram.com/artscope.kr/'
            target='_blank'
            className='hover:text-primary flex items-center gap-0.5'
          >
            <FiInstagram size={18} />
          </Link>
          <Link
            href='https://mediaxi.kr/'
            target='_blank'
            className='hover:text-primary flex items-center gap-0.5'
          >
            <FiCompass size={18} />
          </Link>
          <p className='px-2 text-center text-[0.88rem]'>© 2023 Artscope.</p>
        </div>
      </div>
    </div>
  );
}
