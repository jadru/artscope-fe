'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'react-toastify';

import { useUser } from '@/states';
import jxios from '@/utils/jxios';

type SchduleDeleteButtonProps = {
  scheduleid: number;
  eventAuthorUsername: string;
  eventid: number;
} & React.ComponentProps<'button'>;

export default function SchduleDeleteButton(Props: SchduleDeleteButtonProps) {
  const { refresh } = useRouter();
  const { user, isAdmin } = useUser();
  const handleDeleteSchedule = async () =>
    confirm('정말 삭제하시겠습니까?') &&
    jxios
      .delete(`/api/exhibitions/${Props.eventid}/schedule/${Props.scheduleid}`)
      .then(() => {
        toast.success('스케줄이 삭제되었습니다.');
        refresh();
      });
  return (user && user?.username === Props.eventAuthorUsername) || isAdmin ? (
    <button onClick={handleDeleteSchedule} {...Props} />
  ) : (
    <></>
  );
}
