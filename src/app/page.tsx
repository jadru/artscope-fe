'use client';

import Feed from '@/app/post';

export default function Page() {
  return (
    <>
      <div className='container mx-auto flex flex-col items-center justify-center'>
        <div className='container max-w-screen-md'>
          <Feed />
        </div>
      </div>
    </>
  );
}
