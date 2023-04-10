import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

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
  return (
    <div>
      <Seo />
      <main>
        <section>
          <NavBar />
          <TabLayout>
            <div className='flex flex-col items-center px-2'>
              <Title>Art Playlist</Title>
              <div className='card w-96 bg-base-100 shadow-xl'>
                <figure className='px-10 pt-10'>
                  <Image
                    className='h-full rounded-2xl'
                    src='static/exhibition/2023-01-01.jpeg'
                    alt='2023 금샘 미술관 전시 작품 공모'
                    width={384}
                    height={100}
                  />
                </figure>
                <div className='card-body items-center text-center'>
                  <h1 className='card-title'>
                    2023 금샘 미술관 전시 작품 공모
                  </h1>
                  <p>2023. 04.01 - 05. 30</p>
                  <div className='card-actions'>
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
          <BottomBar tab='playlist' />
        </section>
      </main>
    </div>
  );
}
