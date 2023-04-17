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
      <Seo />
      <section>
        <NavBar dark />
        <TabLayout
          dark
          classNameChild='max-w-none px-0 md:px-0 overflow-hidden'
          paddingTop={false}
        >
          <div className='hero relative min-h-screen px-0 drop-shadow-2xl'>
            <Image
              className='-z-10 brightness-[0.30]'
              src='static/exhibition/2023-01-01.jpeg'
              alt='2023 금샘 미술관 전시 작품 공모'
              fill
              style={{ objectFit: 'cover' }}
            />
            <div className='hero-content flex-col rounded-2xl border border-slate-500 bg-white/20 py-16 px-8 text-gray-100 backdrop-blur-md'>
              <h1 className=''>2023 금샘 미술관 전시 작품 공모</h1>
              <p>2023.04.01 - 05.30</p>
              <Link
                href='/exhibition/2023-summer-ks'
                className='btn-primary btn'
              >
                더 알아보기
              </Link>
            </div>
          </div>
        </TabLayout>
        <Footer dark absolute />
        <BottomBar tab='playlist' dark noSpace />
      </section>
    </main>
  );
}
