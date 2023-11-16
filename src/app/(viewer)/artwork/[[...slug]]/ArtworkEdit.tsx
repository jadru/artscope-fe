'use client';

import { Button, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import TextareaAutoSize from 'react-textarea-autosize';
import { toast } from 'react-toastify';

import jxios from '@/utils/jxios';

import { ArtworkType } from '@/types/artwork';

export default function ArtworkEdit({ data }: { data: ArtworkType }) {
  const { push, refresh } = useRouter();
  const [content, setContent] = useState<string>(data.artwork.description);
  const [title, setTitle] = useState<string>(data.artwork.title);

  const handleEditSave = async () => {
    if (title === '' || content === '') {
      toast.error('제목과 내용은 필수입니다.');
      return;
    }
    jxios
      .put(`/api/artworks/${data.artwork.id}`, {
        description: content,
        title,
        tags: data.artwork.tags,
        visible: true,
      })
      .then((res) => {
        if (res.status === 200) {
          push(`/artwork/${data.artwork.id}`);
          refresh();
          toast.success('수정되었습니다.');
        }
      });
  };

  return (
    <div className='mb-2 space-y-2 border-b border-default-200 bg-white p-3 transition-colors md:mx-0'>
      <div className='w-full px-3 pt-3'>
        <p className='mx-1.5 mt-1 text-default-500 '>
          {new Date(data.artwork.createdTime).toLocaleString('ko-KR', {
            dateStyle: 'full',
            timeStyle: 'short',
          }) + ' 작성'}
        </p>
        {data.artwork.updatedTime && (
          <p className='mx-1.5 mt-0.5 text-default-500 '>
            {new Date(data.artwork.updatedTime).toLocaleString('ko-KR', {
              dateStyle: 'full',
              timeStyle: 'short',
            }) + ' 수정'}
          </p>
        )}
      </div>
      <Input
        defaultValue={data.artwork.title}
        variant='bordered'
        onValueChange={setTitle}
        placeholder='제목을 입력해주세요.'
        label='제목'
        size='lg'
        required
      />
      <TextareaAutoSize
        defaultValue={content}
        placeholder='내용을 입력해주세요.'
        autoFocus
        minRows={10}
        required
        className='min-h-12 max-h-max w-full resize-none rounded-2xl border p-2 text-xl drop-shadow-lg focus:shadow-none focus:shadow-transparent focus:ring-0'
        onChange={(e) => {
          setContent(e.currentTarget.value);
        }}
      />
      <div className='sticky bottom-0 flex h-16 w-full items-center justify-end border-t bg-white p-2'>
        <Button color='primary' onClick={handleEditSave}>
          저장
        </Button>
      </div>
    </div>
  );
}
