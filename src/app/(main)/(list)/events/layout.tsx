import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Events',
  description: '다양한 이벤트를 살펴보세요.',
  openGraph: {
    title: 'Events',
    description: '다양한 이벤트를 살펴보세요.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
