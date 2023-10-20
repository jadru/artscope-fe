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

  if (!result)
    return NextResponse.json(
      { undefined: 'No metadata found' },
      { status: 204 }
    );

  const isEmptyOrNullUndefined = (
    text:
      | string
      | boolean
      | Record<string, string>
      | Array<Record<string, string>>
  ) => {
    if (text === undefined || text === null || text === '') return false;
    else return text;
  };

  return NextResponse.json(
    {
      ogTitle:
        isEmptyOrNullUndefined(result['og:title']) ||
        isEmptyOrNullUndefined(result['twitter:title']) ||
        isEmptyOrNullUndefined(result.title) ||
        isEmptyOrNullUndefined(result.author) ||
        undefined,
      ogUrl:
        isEmptyOrNullUndefined(result['og:url']) ||
        isEmptyOrNullUndefined(result.url) ||
        undefined,
      ogImage:
        isEmptyOrNullUndefined(result['og:image']) ||
        isEmptyOrNullUndefined(result['twitter:image']) ||
        isEmptyOrNullUndefined(result['image']) ||
        undefined,
      ogDescription:
        isEmptyOrNullUndefined(result['og:description']) ||
        isEmptyOrNullUndefined(result['twitter:description']) ||
        isEmptyOrNullUndefined(result.description) ||
        isEmptyOrNullUndefined(result.author) ||
        undefined,
    },
    { status: 200 }
  );
}
