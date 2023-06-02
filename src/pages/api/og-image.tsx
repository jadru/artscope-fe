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
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            tw='w-full overflow-hidden object-cover opacity-30'
            alt=''
            src={NEXT_PUBLIC_MEDIA_STORAGE_URL + '/' + thumbnail}
          />

          <div
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))',
              backgroundClip: 'text',
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              '-webkit-background-clip': 'text',
              color: 'transparent',
              padding: '18px',
              position: 'absolute',
            }}
          >
            {title}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
    // eslint-disable-next-line
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
