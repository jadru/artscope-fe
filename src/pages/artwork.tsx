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
  const {
    data, // 💡 data.pages를 갖고 있는 배열
    error, // error 객체
    fetchNextPage, // 💡 다음 페이지를 불러오는 함수
    // eslint-disable-next-line
    hasNextPage, // 다음 페이지가 있는지 여부, Boolean
    // eslint-disable-next-line
    isFetching, // 첫 페이지 fetching 여부, Boolean, 잘 안쓰인다
    isFetchingNextPage, // 추가 페이지 fetching 여부, Boolean
    status, // 💡 loading, error, success 중 하나의 상태, string
  } = useInfiniteQuery(
    'pokemonList', // data의 이름
    getArtWorkList, // fetch callback, 위 data를 불러올 함수
    {
      // 💡 중요! getNextPageParams가 무한 스크롤의 핵심,
      // getNextPageParam 메서드가 falsy한 값을 반환하면 추가 fetch를 실행하지 않는다
      // falsy하지 않은 값을 return 할 경우 Number를 리턴해야 하며
      // 위의 fetch callback의 인자로 자동으로 pageParam을 전달.
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
    // 기본값이 "0"이기 때문에 스크롤 값이 저장됐을 때에만 window를 스크롤시킨다.
    if (scrollY !== 0) window.scrollTo(0, Number(scrollY));
    // eslint-disable-next-line
  }, []);

  // useObserver로 bottom ref와 onIntersect를 넘겨 주자.
  useObserver({
    target: bottom,
    onIntersect,
  });
  // eslint-disable-next-line
  const OFFSET = 30; // 나중에 편하게 바꿀 수 있도록 page offset을 상수로 설정
  return (
    <div>
      <Seo templateTitle='Artwork' />
      <main>
        <section>
          <NavBar title='ArtPlatform' />
          <TabLayout className='px-2' classNameChild='mt-2'>
            {status === 'loading' && <p>불러오는 중</p>}

            {status === 'error' && <p>{error.message}</p>}
            <ResponsiveGrid>
              {status === 'success' &&
                data.pages.map((group, index) => (
                  // pages들이 페이지 숫자에 맞춰서 들어있기 때문에
                  // group을 map으로 한번 더 돌리는 이중 배열 구조이다.
                  // PoKeApi는 특별한 고유 값이 없기에 key는 적당히 넣어준다.
                  <div key={index} onClick={() => setScrollY(window.scrollY)}>
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
