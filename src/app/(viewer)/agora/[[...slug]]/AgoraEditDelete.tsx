'use client';

import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';

import jxios from '@/utils/jxios';

export default function AgoraEditDelete({
  isMine,
  agoraId,
}: {
  isMine: boolean;
  agoraId: number;
}) {
  const { push } = useRouter();

  const handleDelete = async () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await jxios.delete(`/api/agoras/${agoraId}`).then(() => {
        toast.success('아고라가 삭제되었습니다.');
        push('/agoras');
      });
    }
  };
  return isMine ? (
    <div className='flex justify-between px-1'>
      <Button
        startContent={<AiOutlineDelete />}
        color='danger'
        onClick={handleDelete}
      >
        삭제
      </Button>
    </div>
  ) : (
    <></>
  );
}
