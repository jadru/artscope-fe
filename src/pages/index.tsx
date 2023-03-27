import Link from 'next/link';
import * as React from 'react';

import { ResponsiveGrid } from '@/components/Grid/ResponsiveGrid';
import TabLayout from '@/components/TabLayout';
import { TopMenu } from '@/components/TopMenu';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  return (
    <div>
      <main>
        <section>
          <TabLayout className='px-2' classNameChild='mt-2'>
            <TopMenu />
            <ResponsiveGrid>
              {Array.from({ length: 40 }).map((value, index) => (
                <div
                  className='rounded-md bg-orange-400 p-16'
                  key={'_' + index}
                >
                  <p className='text-white'>{index + 1}</p>
                </div>
              ))}
            </ResponsiveGrid>
          </TabLayout>
          <footer className='absolute bottom-2 text-gray-700'>
            © {new Date().getFullYear()} By{' '}
            <Link href='/about' className='link'>
              Media Xi
            </Link>
          </footer>
        </section>
      </main>
    </div>
  );
}
