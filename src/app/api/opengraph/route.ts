import { NextResponse } from 'next/server';
import urlMetadata from 'url-metadata';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  if (!url)
    return NextResponse.json(
      { error: 'Missing url parameter' },
      { status: 400 }
    );

  const result: urlMetadata.Result = await urlMetadata(url);

  return NextResponse.json(
    {
      ogTitle: result['og:title'] ?? result['title'],
      ogUrl: result['og:url'] ?? result['url'],
      ogImage: result['og:image'] || result['image'],
    },
    { status: 200 }
  );
}
