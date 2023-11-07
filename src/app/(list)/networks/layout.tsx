import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Networks',
  description: '작가, 기획자 등 예술계의 다양한 이들과 교류하세요.',
  openGraph: {
    title: 'Networks',
    description: '작가, 기획자 등 예술계의 다양한 이들과 교류하세요.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
