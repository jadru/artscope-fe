'use client';

import { useState } from 'react';
import {
  AiFillCloseCircle,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from 'react-icons/ai';
import { Slide } from 'react-slideshow-image';

import 'react-slideshow-image/dist/styles.css';

import ASNextImage from '@/components/ASNextImage';

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';

import { EventDetailType } from '@/types/event';

export default function SingleEventMedia({ feed }: { feed: EventDetailType }) {
  const [detailedImage, setDetailedImage] = useState<string>('');
  return (
    <>
      <div className='mt-3 block w-full gap-1'>
        <Slide
          autoplay={false}
          infinite={false}
          transitionDuration={180}
          prevArrow={
            <AiOutlineArrowLeft size={30} className='ml-2 bg-white/50' />
          }
          nextArrow={
            <AiOutlineArrowRight size={30} className='mr-2 bg-white/50' />
          }
        >
          {feed.medias &&
            feed.medias.slice(1).map((item) => (
              <div
                className='flex h-96 cursor-pointer items-center justify-center bg-contain bg-center bg-no-repeat md:h-[600px]'
                style={{
                  backgroundImage: `url(${
                    NEXT_PUBLIC_MEDIA_STORAGE_URL + '/' + item.mediaUrl
                  })`,
                }}
                onClick={() => setDetailedImage(item.mediaUrl)}
                key={item.mediaUrl}
              ></div>
            ))}
        </Slide>
      </div>
      {detailedImage !== '' && (
        <div className='fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center overscroll-none bg-black'>
          <ASNextImage
            src={detailedImage}
            alt={detailedImage}
            fill
            className='h-full w-full object-contain'
          />
          <button className='absolute right-3 top-3 mr-6 mt-6 rounded-full border-2 bg-default-200 text-white'>
            <AiFillCloseCircle size={40} onClick={() => setDetailedImage('')} />
          </button>
        </div>
      )}
    </>
  );
}
