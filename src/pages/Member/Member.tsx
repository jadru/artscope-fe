import Image from 'next/image';
import React from 'react';

import ResponsiveGrid from '@/components/Grid/ResponsiveGrid';
import TabLayout from '@/components/TabLayout';

const Member = () => (
  <TabLayout>
    <div className='flex w-full flex-col items-center'>
      <div className='card flex flex-row'>
        <div className='avatar'>
          <div className='ring-primary w-24 rounded-full ring ring-offset-2 ring-offset-base-100'>
            <Image
              src='/images/stock/photo-1534528741775-53994a69daeb.jpg'
              alt='profile'
            />
          </div>
        </div>
        <div className='flex flex-col'>
          <p>누구누구누구</p>
          <p>@asdfasdf</p>
        </div>
      </div>
      <ResponsiveGrid>
        {Array.from({ length: 40 }).map((value, index) => (
          <div className='rounded-md bg-orange-400 p-16' key={index + '_'}>
            <p className='text-white'>{index + 1}</p>
          </div>
        ))}
      </ResponsiveGrid>
    </div>
  </TabLayout>
);

export default Member;
