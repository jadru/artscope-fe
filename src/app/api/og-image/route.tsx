import { ImageResponse, NextRequest } from 'next/server';

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';

export const runtime = 'edge';

export default function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get('title')?.slice(0, 27);

    const thumbnail = searchParams.get('thumbnail')?.slice(0, 100);

    const name = searchParams.get('name')?.slice(0, 15);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            flexDirection: 'column',
            backgroundColor: '#FFF',
            fontSize: 65,
            lineHeight: 1.02,
            letterSpacing: 0,
            fontWeight: 700,
            textAlign: 'left',
            alignItems: 'center',
            wordBreak: 'keep-all',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            tw='absolute bottom-12 w-5/6 max-h-full max-w-full overflow-hidden object-contain rounded-3xl border-4'
            alt=''
            src={
              NEXT_PUBLIC_MEDIA_STORAGE_URL + '/' + thumbnail + '?w=600&f=webp'
            }
          />

          <p tw='top-0 m-0 px-16 pt-12 pb-6 w-full'>{title}</p>
          <p tw='px-16 text-5xl m-0 w-full'>{name}</p>
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
