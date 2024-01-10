'use client';

import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';

import { useUser } from '@/states';
import jxios from '@/utils/jxios';

export default function SpaceEditDelete({
  authorUsername,
  locationId,
}: {
  authorUsername: string;
  locationId: number;
}) {
  const { push } = useRouter();
  const { user, isAdmin } = useUser();

  const handleDelete = async () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await jxios.delete(`/api/location/${locationId}`).then(() => {
        toast.success('장소가 삭제되었습니다.');
        push('/spaces');
      });
    }
  };
  return user && (user?.username === authorUsername || isAdmin) ? (
    <div className='flex justify-between gap-1 px-1'>
      <Button
        startContent={<AiOutlineDelete />}
        color='danger'
        onClick={handleDelete}>
        삭제
      </Button>
      {/* <Button */}
      {/*   startContent={<AiOutlineEdit />} */}
      {/*   color='primary' */}
      {/*   onClick={() => { */}
      {/*     push(`/edit/space/${locationId}`); */}
      {/*   }}> */}
      {/*   수정 */}
      {/* </Button> */}
    </div>
  ) : (
    <></>
  );
}
