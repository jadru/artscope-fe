'use client';

import { Kbd, Tab, Tabs } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

import Title from '@/components/Title';

import AgoraSearchList from '@/app/(main)/(list)/search/agoraSearchList';
import ArtworkSearchList from '@/app/(main)/(list)/search/artworkSearchList';
import PostSearchList from '@/app/(main)/(list)/search/postSearchList';
import jxios from '@/utils/jxios';

import { searchType } from '@/types/search';

export default function Search() {
  const [data, setData] = useState<searchType>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearchKeyword = searchParams.get('c');
  const [tab, setTab] = useState(searchParams.get('type') ?? 'ALL');

  useEffect(() => {
    if (tab !== searchParams.get('type'))
      setTab(searchParams.get('type') ?? 'ALL');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  const fetchSearch = useCallback(
    async (search: string | null, searchType: string | null) => {
      router.push(
        `/search?c=${search ?? ''}&type=${searchType ?? tab ?? 'ALL'}`
      );
      let url = '';
      switch (tab) {
        case 'ALL':
          url = '/api/search';
          break;
        case 'ARTWORK':
          url = '/api/search/artwork';
          break;
        case 'POST':
          url = '/api/search/post';
          break;
        case 'AGORA':
          url = '/api/search/agora';
          break;
        default:
          url = '/api/search';
          break;
      }

      await jxios
        .get(url, {
          params: {
            keyword: search ?? '',
            size: tab === 'ALL' ? 6 : 24,
          },
        })
        .then((res) => {
          if (tab === 'ARTWORK') {
            setData({
              searchArtworks: res.data,
            });
          } else if (tab === 'POST') {
            setData({
              searchPosts: res.data,
            });
          } else if (tab === 'AGORA') {
            setData({
              searchAgoras: res.data,
            });
          } else {
            setData(res.data);
          }
        });
    },
    [router, tab]
  );

  useEffect(() => {
    fetchSearch(initialSearchKeyword, tab ?? 'ALL');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSearch]);

  return (
    <div className='mb-2 flex flex-col items-stretch justify-center gap-2 px-2'>
      <Title title='Search' description='예술을 검색하세요.' divider={false} />
      <div className='border-default-400 flex h-16 w-full items-center space-x-2 rounded-2xl border px-2.5 py-2'>
        <AiOutlineSearch className='inline' size={25} />
        <input
          type='search'
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              fetchSearch(e.currentTarget.value, tab ?? 'ALL');
            }
          }}
          defaultValue={initialSearchKeyword ?? ''}
          autoFocus={!initialSearchKeyword}
          placeholder='검색어를 입력하세요'
          className='inline h-full w-full border-0 bg-transparent text-2xl focus:border-0 focus:outline-none focus:ring-0'
        />
        <Kbd keys={['enter']} className='h-6'>
          Enter
        </Kbd>
      </div>
      <div>
        <Tabs
          key='ALL'
          variant='solid'
          selectedKey={tab}
          onSelectionChange={(key) => {
            router.push(`/search?c=${initialSearchKeyword ?? ''}&type=${key}`, {
              shallow: true,
            });
            setTab(key as string);
          }}
          disabledKeys={['EVENT']}
          aria-label='Tabs variants'>
          <Tab key='ALL' title='통합 검색' />
          <Tab key='ARTWORK' title='작품' />
          <Tab key='POST' title='포스트' />
          <Tab key='AGORA' title='아고라' />
          <Tab key='EVENT' title='이벤트' />
        </Tabs>
      </div>
      {data &&
        data.searchArtworks &&
        data.searchArtworks.artworks.length > 0 && (
          <ArtworkSearchList
            artworks={data.searchArtworks.artworks}
            pageInfo={data.searchArtworks.pageInfo}
            initialSearchKeyword={initialSearchKeyword}
            expanded={tab === 'ARTWORK'}
          />
        )}
      {data && data.searchPosts && data.searchPosts.posts.length > 0 && (
        <PostSearchList
          posts={data.searchPosts.posts}
          pageInfo={data.searchPosts.pageInfo}
          initialSearchKeyword={initialSearchKeyword}
          expanded={tab === 'POST'}
        />
      )}
      {data && data.searchAgoras && data.searchAgoras.agoras.length > 0 && (
        <AgoraSearchList
          agoras={data.searchAgoras.agoras}
          pageInfo={data.searchAgoras.pageInfo}
          initialSearchKeyword={initialSearchKeyword}
          expanded={tab === 'AGORA'}
        />
      )}
    </div>
  );
}
