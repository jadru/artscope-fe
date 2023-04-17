import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import useAuth from '@/hooks/useAuth';

import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

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
      <Seo themeColor='#000000' />
      <section>
        <NavBar dark />
        <TabLayout
          dark
          classNameChild='max-w-none px-0 md:px-0 overflow-hidden touch-none'
          paddingTop={false}
        >
          <div className='hero relative min-h-screen px-0 drop-shadow-2xl'>
            <Image
              className='-z-10 overflow-hidden brightness-[0.14] md:brightness-[0.30]'
              src='static/exhibition/2023-01-01.jpeg'
              alt='2023 금샘 미술관 전시 작품 공모'
              fill
              style={{ objectFit: 'cover' }}
            />
            <div className='hero-content flex-col border-slate-500 py-16 text-gray-100 md:rounded-2xl md:border md:bg-black/30 md:px-8 md:backdrop-blur-md'>
              <h1 className=''>2023 금샘 미술관 전시 작품 공모</h1>
              <p>2023.04.01 - 05.30</p>
              <Link
                href='/exhibition/2023-summer-ks'
                className='btn-primary btn'
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
