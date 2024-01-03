'use client';

import { Button } from '@nextui-org/react';
import { useDebounce } from '@toss/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaVoteYea } from 'react-icons/fa';
import { toast } from 'react-toastify';

import '@/styles/editor.scss';

import StandardEditor from '@/components/StandardEditor';

import { initialPostSchema } from '@/app/new/post/initialPostSchema';
import jxios from '@/utils/jxios';

import { ArtWorkMediaType } from '@/types/artwork';

const NewPost = () => {
  const { push, replace } = useRouter();
  const [isUpload, setIsUpload] = useState(false);

  const handleSubmitPostButton = useDebounce(
    async (markdown: string, fileUrls: ArtWorkMediaType[]) => {
      try {
        if (markdown.length < 10) {
          toast.warn('10자 이상 입력해주세요.');
          return;
        }
        if (markdown.length > 1000) {
          toast.warn('1000자 이하로 입력해주세요.');
          return;
        }
        if (
          fileUrls.reduce(
            (acc, cur) => (cur.file ? cur.file.size + acc : acc),
            0
          ) /
            1000000 >
          100
        ) {
          setIsUpload(false);
          toast.warn('파일 용량이 너무 큽니다.');
          return;
        }
        setIsUpload(true);
        const newState = { ...initialPostSchema };
        newState.dto.content = markdown;

        const formData = new FormData();
        if (fileUrls.length > 0) {
          newState.dto.thumbnail = {
            mediaType: 'image',
          };
          formData.append('thumbnailFile', fileUrls[0].file as File);
          newState.dto.medias = [];
          fileUrls.forEach((media) => {
            formData.append('mediaFiles', media.file as File);
            newState.dto.medias?.push({
              mediaType: media.mediaType,
            });
          });
        }
        formData.append(
          'dto',
          new Blob([JSON.stringify(newState.dto)], {
            type: 'application/json',
          })
        );
        await jxios
          .post('/api/posts', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json',
            },
          })
          .then((res) => {
            if (res.status === 201) {
              toast.success('포스트가 업로드되었습니다.');
              push('/');
            }
          })
          .catch((err) => {
            setIsUpload(false);
            toast.error(err.response.data);
          });
      } catch (err) {
        toast.error((err as string) || '포스트 업로드에 실패했습니다.');
      } finally {
        setIsUpload(false);
      }
    },
    500
  );

  return (
    <StandardEditor
      placeholderText='포스트를 작성해주세요.'
      onSubmit={handleSubmitPostButton}
      isUpload={isUpload}
      submitText='포스트 작성'
      footer={
        <Button
          startContent={<FaVoteYea size={23} />}
          variant='solid'
          onClick={() => {
            if (
              confirm(
                '아고라로 이동하면 편집하던 내용이 사라집니다. 이동하시겠습니까?'
              )
            ) {
              replace('/new/agora');
            }
          }}
          color='secondary'>
          아고라 작성
        </Button>
      }
    />
  );
};

export default NewPost;
