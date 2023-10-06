import { ComponentPropsWithoutRef } from 'react';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

type SkeletonProps = ComponentPropsWithoutRef<'h1'>;

const Title = ({ className, children, ...rest }: SkeletonProps) => (
  <h1
    className={clsxm('my-5 block text-center text-3xl font-bold', className)}
    {...rest}
  >
    {children}
  </h1>
);

export default Title;
