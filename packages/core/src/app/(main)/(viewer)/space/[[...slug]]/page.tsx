import { redirect } from 'next/navigation';

import StandardLabel from '@/components/StandardLabel';

import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { LocationDataType } from '@/types/location';

const fetchSpace = async (id: string) =>
  await jxios
    .get(NEXT_PUBLIC_API_URL + '/api/location/' + id)
    .then((res) => res.data as LocationDataType);

export default async function SpacePage({
  params,
}: {
  params: { slug: string[] };
}) {
  if (!params.slug) redirect('/');
  const data = await fetchSpace(params.slug[0]);
  if (!data) throw new Error('Failed to fetch data');
  return (
    <div>
      <StandardLabel label={data.address} />
    </div>
  );
}
