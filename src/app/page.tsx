'use client';

import { Tab, Tabs } from '@nextui-org/react';
import { useState } from 'react';

import Artwork from '@/app/feed/artwork';
import Feed from '@/app/feed/post';
import { TabType } from '@/app/FeedList';

export default function Page() {
  const [tab, setTab] = useState<TabType>('feed');

  return (
    <>
      <div className='container mx-auto flex flex-col items-center justify-center border-y'>
        <div className='container max-w-screen-md'>
          <Tabs
            variant='solid'
            defaultValue={tab}
            onSelectionChange={(e) => {
              setTab(e as TabType);
            }}
            className='mb-1.5'
          >
            <Tab key='feed' title='피드' />
            <Tab key='artwork' title='작품' />
            <Tab key='exhibition' title='전시회' />
            <Tab key='artist' title='작가' />
            <Tab key='place' title='장소' />
            <Tab key='tag' title='태그' />
            <Tab key='search' title='검색' />
          </Tabs>
          {tab === 'feed' && <Feed />}
          {tab === 'artwork' && <Artwork />}
        </div>
      </div>
    </>
  );
}
