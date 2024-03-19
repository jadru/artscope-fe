'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdOutlineDelete, MdOutlineEdit } from 'react-icons/md';
import { toast } from 'react-toastify';

import { useUser } from '@/states';
import jxios from '@/utils/jxios';

export default function ArticleViewerActions({
  authorUsername,
  id,
}: {
  authorUsername: string;
  id: string;
}) {
  const { user, isAdmin } = useUser();
  const router = useRouter();
  const handleDelete = () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    jxios.delete('/api/magazines/' + id).then((response) => {
      if (response.status === 200) {
        toast.success('아티클이 삭제되었습니다.');
        router.push('/editor');
      }
    });
  };
  return (
    <>
      {(user && user.username === authorUsername) || isAdmin ? (
        <div className='bg-gray-300 flex gap-4 items-center justify-end p-6'>
          <Link href={'/editor/' + id + '/modify'}>
            <MdOutlineEdit size={28} />
          </Link>
          <button onClick={handleDelete}>
            <MdOutlineDelete size={28} />
          </button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
