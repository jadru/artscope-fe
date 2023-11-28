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

  const imageProccess = () => {
    let ogImage =
      isEmptyOrNullUndefined(result['og:image']) ||
      isEmptyOrNullUndefined(result['twitter:image']) ||
      isEmptyOrNullUndefined(result.image) ||
      isEmptyOrNullUndefined(result.icon) ||
      isEmptyOrNullUndefined(result.shortcut) ||
      isEmptyOrNullUndefined(result['msapplication-TileImage']) ||
      isEmptyOrNullUndefined(result['shortcut icon']) ||
      isEmptyOrNullUndefined(result['apple-touch-icon']);
    if (!ogImage) return undefined;
    if (Array.isArray(ogImage)) ogImage = ogImage[0];
    if (typeof ogImage === 'string' && ogImage.startsWith('http')) {
      return ogImage;
    } else {
      return (
        String(url).match(/(http(s)?:\/\/)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}/gi) +
        (ogImage as string)
      );
    }
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
      ogImage: imageProccess(),
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
