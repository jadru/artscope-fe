import Lottie from 'lottie-react';
import Link from 'next/link';
import * as React from 'react';

import useAuth from '@/hooks/useAuth';

import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

import ArtistAnimation from '../../public/animation/141993-spin-sobky-like-siri.json';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function HomePage() {
  useAuth();
  return (
    <main>
      <Seo themeColor='#917FB3' />
      <section>
        <NavBar transparent dark />
        <TabLayout
          dark
          main
          className='relative min-h-screen touch-none overflow-hidden bg-[#917FB3] sm:min-h-screen'
          classNameChild='max-w-none px-0 md:px-0 overflow-hidden bg-[#917FB3] h-screen'
          paddingTop={false}
        >
          <div className='relative h-screen overflow-hidden px-0 sm:-mt-36 md:mt-0'>
            <Lottie
              animationData={ArtistAnimation}
              className='-mt-36 h-[130vh] w-[190vw] overflow-hidden lg:h-[200vh] lg:w-[120vw]'
            />
            <div className='absolute top-1/3 left-6 flex-col space-y-3 py-8 text-gray-100 md:left-24'>
              <h1>2023 금샘 미술관 전시 작품 공모</h1>
              <p>2023.04.01 - 05.30</p>
              <Link
                href='/exhibition/2023-summer-ks'
                className='btn-outline btn text-gray-100 hover:bg-gray-100 hover:text-gray-900'
              >
                더 알아보기
              </Link>
              <Footer dark left />
            </div>
          </div>
        </TabLayout>
        <BottomBar tab='playlist' dark noSpace />
      </section>
    </main>
  );
}
