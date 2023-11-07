import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Search',
  description: '예술 작품, 포스트 등 궁금한 것을 검색하세요.',
  openGraph: {
    title: 'Search',
    description: '예술 작품, 포스트 등 궁금한 것을 검색하세요.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
