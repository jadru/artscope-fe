import axios from 'axios';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import useLocalStorage from 'use-local-storage';

import { useObserver } from '@/hooks/useObserver';

import ResponsiveGrid from '@/components/Grid/ResponsiveGrid';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

const OFFSET = 30;
const getArtWorkList = ({ pageParam = OFFSET }) =>
  axios
    .get('https://pokeapi.co/api/v2/pokemon', {
      // axios.get(url, config),
      // url전체를 템플릿 리터럴로 넘기든 config의 params로 넘기든 취향에 맞게 넘기자.
      params: {
        limit: OFFSET,
        offset: pageParam,
      },
    })
    .then((res) => res?.data);
export default function Playlist() {
  const bottom = useRef(null);
  const { data, error, fetchNextPage, isFetchingNextPage, status } =
    useInfiniteQuery(
      'pokemonList', // data의 이름
      getArtWorkList,
      {
        getNextPageParam: (lastPage) => {
          const { next } = lastPage;
          if (!next) return false;
          return Number(new URL(next).searchParams.get('offset'));
        },
      }
    );
  const [scrollY, setScrollY] = useLocalStorage('artwork_list_scroll', 0);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const onIntersect = ([entry]) => entry.isIntersecting && fetchNextPage();

  useEffect(() => {
    if (scrollY !== 0) window.scrollTo(0, Number(scrollY));
    // eslint-disable-next-line
  }, []);

  useObserver({
    target: bottom,
    onIntersect,
  });

  return (
    <div>
      <Seo templateTitle='Artwork' />
      <main>
        <section>
          <NavBar title='ArtPlatform' />
          <TabLayout className='px-2' classNameChild='mt-2'>
            {status === 'loading' && <p>불러오는 중</p>}
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/** @ts-ignore **/}
            {status === 'error' && <p>{error.message}</p>}
            <ResponsiveGrid>
              {status === 'success' &&
                data.pages.map((group, index) => (
                  <div key={index} onClick={() => setScrollY(window.scrollY)}>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/** @ts-ignore **/}
                    {group.results.map((pokemon) => (
                      <p key={pokemon.name}>{pokemon.name}</p>
                    ))}
                  </div>
                ))}
              <div ref={bottom} />
              {isFetchingNextPage && <p>계속 불러오는 중</p>}
            </ResponsiveGrid>
          </TabLayout>
          <BottomBar tab='artwork' />
        </section>
      </main>
    </div>
  );
}
