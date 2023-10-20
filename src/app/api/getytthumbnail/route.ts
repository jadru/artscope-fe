import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id)
    return NextResponse.json(
      { error: 'Missing id parameter' },
      { status: 400 }
    );

  const result = await fetch(
    'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg',
    {
      headers: {
        'Content-Type': 'image/jpeg',
        Accept: '*/*',
      },
    }
  );

  if (!result)
    return NextResponse.json(
      { undefined: 'No metadata found' },
      { status: 204 }
    );

  return NextResponse.json(result.blob(), {
    headers: {
      'Content-Type': 'image/jpeg',
      Accept: '*/*',
    },
    status: 200,
  });
}
