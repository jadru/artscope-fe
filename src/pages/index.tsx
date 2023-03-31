import Link from 'next/link';
import * as React from 'react';

import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';
import TopMenu from '@/components/TopMenu';

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
          <NavBar title='ArtPlatform' />
          <TabLayout className='px-2' classNameChild='mt-2'>
            <TopMenu />
            <div className='flex flex-col'>
              <div className='card image-full max-h-44 w-96 bg-base-100 shadow-xl'>
                <video
                  className='max-h-48 w-full rounded-2xl object-cover'
                  src={require('~/videos/banner_1.webm')}
                  loop
                  autoPlay
                  muted
                />
                <div className='card-body'>
                  <h2 className='card-title'>
                    2023 금샘 미술관 전시 작품 공모
                  </h2>
                  <p>🥤 접수기간 : 2023. 04.01 - 05. 30</p>
                  <div className='card-actions justify-end'>
                    <Link
                      className='btn-primary btn'
                      href='/exhibition/2023-summer-ks'
                    >
                      전시 알아보기
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
