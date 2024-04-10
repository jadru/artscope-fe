'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className='flex gap-4 w-full min-h-full p-6 max-w-screen-lg mx-auto'>
      <nav className='grid gap-4 text-muted-foreground w-1/4 max-h-screen self-start'>
        <h2 className='text-primary mb-4'>설정</h2>
        <p className='text-primary text-sm'>DEFAULT</p>
        <Link
          href='/editor/settings'
          className={
            pathname === '/editor/settings' ? 'font-semibold text-primary' : ''
          }>
          계정
        </Link>
        <Link
          href='/editor/settings/artist'
          className={
            pathname === '/editor/settings/artist'
              ? 'font-semibold text-primary'
              : ''
          }>
          작가 정보
        </Link>
        <Link
          href='/editor/settings/notification'
          className={
            pathname === '/editor/settings/notification'
              ? 'font-semibold text-primary'
              : ''
          }>
          알림
        </Link>
        <p className='text-primary text-sm mt-1.5'>TEAM</p>
        <Link
          href='/editor/settings/team/new'
          className={
            pathname === '/editor/settings/team/new'
              ? 'font-semibold text-primary'
              : ''
          }>
          팀 생성
        </Link>
        <Link
          href='/editor/settings/team'
          className={
            pathname === '/editor/settings/team'
              ? 'font-semibold text-primary'
              : ''
          }>
          팀 관리
        </Link>
        <Link
          href='/editor/settings/team/member'
          className={
            pathname === '/editor/settings/team/member'
              ? 'font-semibold text-primary'
              : ''
          }>
          팀원 관리
        </Link>
      </nav>
      <div className='w-3/4 space-y-4'>{children}</div>
    </div>
  );
}
