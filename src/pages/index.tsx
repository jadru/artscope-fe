import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

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
  return (
    <div>
      <Seo templateTitle='Playlist' />
      <main>
        <section>
          <NavBar />
          <TabLayout>
            <div className='flex flex-col items-center px-2'>
              <h1 className='py-6 text-3xl font-light'>Art Playlist</h1>
              <Link
                href='/exhibition/2023-summer-ks'
                className='card image-full max-h-44 w-full bg-base-100 shadow-xl hover:bg-blend-lighten md:w-2/3'
              >
                <Image
                  className='h-full w-full rounded-2xl object-cover'
                  src='static/exhibition/2023-01-03.jpeg'
                  alt='2023 금샘 미술관 전시 작품 공모'
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                />
                <div className='card-body h-full justify-center'>
                  <h2 className='card-title'>
                    2023 금샘 미술관 전시 작품 공모
                  </h2>
                  <p>🥤 접수기간 : 2023. 04.01 - 05. 30</p>
                </div>
              </Link>
            </div>
          </TabLayout>
          <BottomBar tab='playlist' />
        </section>
      </main>
    </div>
  );
}
