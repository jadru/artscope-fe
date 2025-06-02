'use client';

import { CheckedState } from '@radix-ui/react-checkbox';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

import FormCard from '@/components/FormCard';
import { Checkbox } from '@/components/ui/checkbox';

import jxios from '@/utils/jxios';

export default function NotiEmailSetting(props: {
  username: string;
  emailReceive?: boolean;
  emailReceiveUpdatedAt?: string;
}) {
  const [checked, setChecked] = useState(props.emailReceive);
  const router = useRouter();
  const onCheckboxChange = (checked: CheckedState) =>
    jxios
      .put(
        '/api/members/' + props.username + '/email-receive',
        {},
        {
          params: {
            emailReceive: checked,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success(
            `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} 알림 설정이 ${
              checked ? '동의' : '동의 철회'
            }되었습니다.`
          );
          setChecked(checked as boolean);
          router.refresh();
        }
      });
  return (
    <FormCard title='알림 설정'>
      <div className='items-top flex space-x-2'>
        <Checkbox
          id='terms1'
          onCheckedChange={onCheckboxChange}
          checked={checked}
        />
        <div className='grid gap-1.5 leading-none'>
          <label
            htmlFor='terms1'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
            홍보성 이메일 알림 동의
          </label>
          <p className='text-sm text-muted-foreground'>
            예술 관련 공지 및 이벤트 안내, 뉴스레터 등 홍보성 이메일 알림에
            동의합니다.
          </p>
          <p className='text-sm text-muted-foreground'>
            {props.emailReceiveUpdatedAt
              ? `${format(
                  new Date(props.emailReceiveUpdatedAt),
                  'yyyy-MM-dd HH:mm:ss'
                )}에 동의하셨습니다.`
              : ''}
          </p>
        </div>
      </div>
    </FormCard>
  );
}
