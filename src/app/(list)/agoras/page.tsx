import Title from '@/components/Title';

import AgoraItem from '@/app/(list)/agoras/AgoraItem';
import AgoraPagination from '@/app/(list)/agoras/AgoraPagination';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { AgoraListType } from '@/types/agora';

const fetchAgora = async (page: number) =>
  jxios
    .get(NEXT_PUBLIC_API_URL + '/api/agoras', {
      params: {
        page: page - 1,
        size: 10,
      },
    })
    .then((res) => res.data as AgoraListType);

export default async function AgoraListPage({
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const data = await fetchAgora(
    Number(searchParams?.page ? searchParams.page : 1)
  );
  return (
    <div>
      <Title
        title='Agora'
        description='다양한 주제에 대해 토론하고 투표하세요.'
      />
      {data.agoras.map((agora) => (
        <AgoraItem agora={agora} key={agora.id} />
      ))}
      <div className='mt-4 flex justify-center'>
        <AgoraPagination
          totalPage={data.pageInfo.totalPages}
          page={Number(searchParams?.page ? searchParams.page : 1)}
        />
      </div>
    </div>
  );
}
