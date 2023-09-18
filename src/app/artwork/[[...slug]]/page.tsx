import { NEXT_PUBLIC_API_URL } from '@/constant/env';

import { ArtworkType } from '@/types';

const fetchArtwork = async (id: string) =>
  fetch(NEXT_PUBLIC_API_URL + '/api/artworks/' + id).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  });

export default async function ProfilePage({
  params,
}: {
  params: { slug: string[] };
}) {
  const data: ArtworkType = await fetchArtwork(params.slug[0]);
  return <div>{data.artwork.authorUsername}</div>;
}
