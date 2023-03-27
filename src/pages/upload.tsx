import React, { useState } from 'react';

import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';

const Upload = () => {
  const [,] = useState(false);
  return (
    <>
      <TabLayout>
        <div className='flex h-full w-full items-center justify-center'>
          <form className='flex flex-col space-y-2 sm:w-full md:w-[400px]'>
            <input
              type='file'
              className='file-input-bordered file-input-primary file-input w-full'
              multiple
            />
            <div className='flex min-w-full flex-row overflow-x-scroll'>
              {Array.from({ length: 40 }).map((value, index) => (
                <div
                  className='rounded-md bg-orange-400 p-16'
                  key={index + '_'}
                >
                  <button className='btn' />
                  <p className='text-white'>{index + 1}</p>
                  <input type='text' />
                </div>
              ))}
            </div>
            <textarea
              className='textarea-primary textarea resize-none'
              placeholder='Bio'
            />
            <button className='btn-primary btn' type='submit'>
              Submit
            </button>
          </form>
        </div>
      </TabLayout>
      <BottomBar tab='upload' />
    </>
  );
};

export default Upload;
