import { Skeleton } from '@nextui-org/react';
import React from 'react';

const SkeletonEvent = () => (
  <>
    <div className='flex w-full flex-col gap-2 px-4 py-4'>
      <div className='flex w-full max-w-[300px] items-center gap-3'>
        <div>
          <Skeleton className='flex h-12 w-12 rounded-full' />
        </div>
        <div className='flex w-full flex-col gap-2'>
          <Skeleton className='h-3 w-3/5 rounded-lg' />
          <Skeleton className='h-3 w-4/5 rounded-lg' />
        </div>
      </div>
      <Skeleton className='h-4 w-full rounded-full' />
      <Skeleton className='h-4 w-full rounded-full' />
      <div className='flex flex-row gap-3'>
        <Skeleton className='h-5 w-[60px] rounded-full' />
        <Skeleton className='h-5 w-[60px] rounded-full' />
        <Skeleton className='h-5 w-[60px] rounded-full' />
        <Skeleton className='h-5 w-[60px] rounded-full' />
      </div>
      <Skeleton className='mx-1 mt-4 h-0.5 rounded-full' />
    </div>
  </>
);

export default SkeletonEvent;
