import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import useAuth from '@/hooks/useAuth';

import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';
import Title from '@/components/Title';

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
    <div>
      <Seo />
      <main>
        <section>
          <NavBar />
          <TabLayout>
            <div className='flex flex-col items-center px-2'>
              <Title>Art Playlist</Title>
              <div className='mx-2 flex w-full dark:border-neutral-500'>
                <div className='relative h-80 w-full items-center rounded-2xl text-center'>
                  <Image
                    className='-z-10 rounded-2xl'
                    src='static/exhibition/2023-01-01.jpeg'
                    alt='2023 금샘 미술관 전시 작품 공모'
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div className='flex h-full w-full flex-col items-center justify-center space-y-3 bg-white/80 backdrop-blur-md'>
                    <h1 className=''>2023 금샘 미술관 전시 작품 공모</h1>
                    <p>2023. 04.01 - 05. 30</p>
                    <Link
                      href='/exhibition/2023-summer-ks'
                      className='btn-primary btn'
                    >
                      더 알아보기
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </TabLayout>
          <Footer />
          <BottomBar tab='playlist' />
        </section>
      </main>
    </div>
  );
}
