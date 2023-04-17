import Lottie from 'lottie-react';
import Link from 'next/link';
import * as React from 'react';

import useAuth from '@/hooks/useAuth';

import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

import ArtistAnimation from '../../public/animation/70504-artist-illustration.json';

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
          classNameChild='max-w-none px-0 md:px-0 overflow-hidden bg-[#917FB3] touch-action-none'
          paddingTop={false}
        >
          <div className='hero relative h-screen px-0 sm:-mt-36 md:mt-0'>
            <div className='hero-content flex-col py-8 text-gray-100'>
              <Lottie
                animationData={ArtistAnimation}
                className='mx-12 sm:-mt-36 md:-mt-12'
              />
              <h1>2023 금샘 미술관 전시 작품 공모</h1>
              <p>2023.04.01 - 05.30</p>
              <Link
                href='/exhibition/2023-summer-ks'
                className='btn-outline btn-accent btn'
              >
                더 알아보기
              </Link>
              <Footer dark />
            </div>
          </div>
        </TabLayout>
        <BottomBar tab='playlist' dark noSpace />
      </section>
    </main>
  );
}
