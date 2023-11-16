import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Artworks',
  description: '감각적인 예술 작품들을 살펴보세요.',
  openGraph: {
    title: 'Artworks',
    description: '감각적인 예술 작품들을 살펴보세요.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
