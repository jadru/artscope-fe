'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { LocationType } from '@/types/location';

type LocationButtonProps = {
  location: LocationType;
} & React.ComponentProps<'button'>;

const LocationButton = ({ ...props }: LocationButtonProps) => {
  const { push } = useRouter();
  return (
    <button
      onClick={() => {
        push(
          `nmap://place?lat=${props.location.latitude}&lng=${props.location.longitude}&name=${props.location.name}&appname=artscope.kr`,
          {}
        );
      }}
      {...props}
    >
      {props.children}
    </button>
  );
};

export default LocationButton;
