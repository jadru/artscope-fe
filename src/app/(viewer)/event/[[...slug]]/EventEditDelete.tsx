'use client';

import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { toast } from 'react-toastify';

import { useUser } from '@/states';
import jxios from '@/utils/jxios';

export default function EventEditDelete({
  authorUsername,
  eventId,
}: {
  authorUsername: string;
  eventId: number;
}) {
  const { push } = useRouter();
  const { user } = useUser();

  const handleDelete = async () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await jxios.delete(`/api/exhibitions/${eventId}`).then(() => {
        toast.success('이벤트가 삭제되었습니다.');
        push('/events');
      });
    }
  };
  return user?.name === authorUsername ? (
    <div className='flex justify-between gap-1 px-1'>
      <Button
        startContent={<AiOutlineDelete />}
        color='danger'
        onClick={handleDelete}
      >
        삭제
      </Button>
      <Button
        startContent={<AiOutlineEdit />}
        color='primary'
        onClick={() => {
          push(`/edit/event/${eventId}`);
        }}
      >
        수정
      </Button>
    </div>
  ) : (
    <></>
  );
}
