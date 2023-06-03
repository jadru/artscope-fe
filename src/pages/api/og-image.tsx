import { ImageResponse, NextRequest } from 'next/server';

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';

export const config = {
  runtime: 'edge',
};

export default function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get('title')?.slice(0, 100);

    const thumbnail = searchParams.get('thumbnail')?.slice(0, 100);

    const name = searchParams.get('name')?.slice(0, 15);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
            fontSize: 65,
            letterSpacing: -2,
            fontWeight: 700,
            textAlign: 'center',
            wordBreak: 'keep-all',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            tw='absolute top-0 h-full min-w-full min-h-full overflow-hidden object-cover opacity-30'
            alt=''
            src={
              NEXT_PUBLIC_MEDIA_STORAGE_URL + '/' + thumbnail + '?w=600&f=webp'
            }
          />

          <p tw='m-0 p-4'>{title}</p>
          <p tw='text-5xl m-0'>{name}</p>
          <p tw='absolute bottom-0 text-4xl px-6 py-3 bg-black/50 rounded-3xl text-white'>
            Artscope
          </p>
        </div>
      ),
      {
        width: 800,
        height: 800,
      }
    );
    // eslint-disable-next-line
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
