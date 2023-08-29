'use client';

import { Tab, Tabs } from '@nextui-org/react';
import { useState } from 'react';

import FeedListItem from '@/app/new/FeedListItem';

type TypeType = 'artwork' | 'post' | 'exhibition';

type TabType = 'feed' | 'post' | 'artwork' | 'exhibition';

export type FeedItemType = {
  id: number;
  type: TypeType;
  title: string;
  content?: string;
  thumbnail?: string;
  authorName: string;
  authorDescription?: string;
  authorId: string;
  authorProfileImage?: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  saveCount: number;
  createdAt: string;
  updatedAt?: string;
};

export type FeedType = FeedItemType[];

export default function FeedList({ data }: { data: FeedType }) {
  const [tab, setTab] = useState<TabType>('feed');
  return (
    <>
      <Tabs
        variant='underlined'
        onSelectionChange={(e) => {
          setTab(e as TabType);
        }}
      >
        <Tab key='feed' title='피드' />
        <Tab key='post' title='이야기' />
        <Tab key='artwork' title='작품' />
        <Tab key='exhibition' title='전시' />
      </Tabs>
      <div className='flex flex-col'>
        {tab === 'feed'
          ? data.map((feed) => <FeedListItem feed={feed} key={feed.id} />)
          : data
              .filter((feed) => feed.type === tab)
              .map((feed) => <FeedListItem feed={feed} key={feed.id} />)}
      </div>
    </>
  );
}
