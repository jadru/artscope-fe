'use client';

import { Pagination } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

export default function AgoraPagination({
  totalPage,
  page,
}: {
  totalPage: number;
  page: number;
}) {
  const { push } = useRouter();
  return (
    <Pagination
      total={totalPage}
      page={page}
      onChange={(page) => push(String(`/agoras?page=${page}`))}
    />
  );
}
