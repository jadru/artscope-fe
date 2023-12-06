'use client';

import { Carousel } from '@ark-ui/react';
import { useState } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';

import 'react-slideshow-image/dist/styles.css';

import ASNextImage from '@/components/ASNextImage';

import { MediaTypeInfo } from '@/types/media';

export default function MediaSlider({ medias }: { medias: MediaTypeInfo[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <Carousel.Root
      index={currentIndex}
      onIndexChange={(details) => setCurrentIndex(details.index)}
      className='relative w-full overflow-hidden'
      orientation='horizontal'
      align='center'>
      <Carousel.Viewport>
        <Carousel.ItemGroup>
          {medias.map((image, index) => (
            <Carousel.Item key={index} index={index}>
              <ASNextImage
                className='w-full rounded-xl border-2 object-cover'
                src={image.mediaUrl}
                alt={image.mediaUrl}
                width={500}
                height={300}
              />
            </Carousel.Item>
          ))}
        </Carousel.ItemGroup>
      </Carousel.Viewport>
      <Carousel.IndicatorGroup className='absolute bottom-5 left-1/2 -translate-x-1/2'>
        <Carousel.Control className='div flex gap-2 rounded-xl border bg-white/90 px-3 py-2'>
          <Carousel.PrevTrigger>
            <BsArrowLeft size={20} />
          </Carousel.PrevTrigger>
          {medias.map((_, index) => (
            <Carousel.Indicator key={index} index={index}>
              <div
                className={`h-3 w-3 rounded-full ${
                  index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            </Carousel.Indicator>
          ))}
          <Carousel.NextTrigger>
            <BsArrowRight size={20} />
          </Carousel.NextTrigger>
        </Carousel.Control>
      </Carousel.IndicatorGroup>
    </Carousel.Root>
  );
}
