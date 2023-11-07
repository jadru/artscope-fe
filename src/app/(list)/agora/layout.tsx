import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Agora',
  description: '다양한 주제에 대해 토론하고 투표하세요.',
  openGraph: {
    title: 'Agora',
    description: '다양한 주제에 대해 토론하고 투표하세요.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
