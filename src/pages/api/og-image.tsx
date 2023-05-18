import { ImageResponse, NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // ?title=<title>

    const title = searchParams.get('title')?.slice(0, 100);

    // const username = searchParams.get('username')?.slice(0, 100);
    //
    // const name = searchParams.get('name')?.slice(0, 100);
    //
    // const profileUrl = searchParams.get('profileUrl')?.slice(0, 100);

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
        >
          <h1 tw='truncate p-6 text-center text-8xl font-light text-blue-600'>
            {title ? title : 'Artwork'}
          </h1>
          <p tw='absolute bottom-8 bg-white text-4xl text-black'>Artscope</p>
        </div>
      ),
      {
        width: 1200,
        height: 600,
      }
    );
    // eslint-disable-next-line
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
