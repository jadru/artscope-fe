import Lottie from 'lottie-react';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

import SoundAnimation from '../../public/animation/17807-sound-animation.json';

type SoundProps = React.ComponentPropsWithoutRef<'div'>;

export default function AudioFileGridItem({ className, ...rest }: SoundProps) {
  return (
    <div
      className={clsxm(
        'flex items-center justify-center bg-gray-300',
        className
      )}
      {...rest}
    >
      <Lottie animationData={SoundAnimation} />
    </div>
  );
}
