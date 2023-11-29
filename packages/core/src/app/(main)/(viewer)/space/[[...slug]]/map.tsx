'use client';

import Script from 'next/script';
import React from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

import { KAKAO_MAP_JS_API_KEY } from '@/constant/env';

export default function MapPage({
  latitude,
  longitude,
  name,
  address,
}: {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
}) {
  return (
    <>
      <Script
        type='text/javascript'
        strategy='beforeInteractive'
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_JS_API_KEY}&libraries=services&autoload=false`}
      />
      <Map
        center={{ lat: latitude, lng: longitude }}
        style={{ width: '100%', height: '360px' }}
        level={3}
      >
        <MapMarker position={{ lat: latitude, lng: longitude }}>
          <div className='flex flex-col rounded-xl p-3'>
            <b>{name}</b>
            <p>{address}</p>
          </div>
        </MapMarker>
      </Map>
    </>
  );
}
