import * as React from 'react';

import ResponsiveGrid from '@/components/Grid/ResponsiveGrid';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import TopMenu from '@/components/TopMenu';

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
          <BottomBar tab='artwork' />
        </section>
      </main>
    </div>
  );
}
