'use client';

import { Input } from '@nextui-org/react';
import { useDebounce } from '@toss/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import '@/styles/editor.scss';

import StandardEditor from '@/components/StandardEditor';

import AnonymousCheckBox from '@/app/new/agora/AnonymousCheckBox';
import { initialAgoraSchema } from '@/app/new/agora/initialAgoraSchema';
import jxios from '@/utils/jxios';

import { ArtWorkMediaType } from '@/types/artwork';

const NewArtwork = () => {
  const { push } = useRouter();
  const [anonymousType, setAnonymousType] = useState<boolean>(true);
  const [isUpload, setIsUpload] = useState(false);
  const [buttonText, setButtonText] = useState<{
    agreeText: string;
    naturalText: string;
    disagreeText: string;
  }>({
    agreeText: '',
    naturalText: '',
    disagreeText: '',
  });

  const handleCreateSaveButton = useDebounce(
    async (markdown: string, medias: ArtWorkMediaType[]) => {
      if (isUpload) return;
      const markdownContent = markdown.slice(markdown.indexOf('\n') + 1);
      const title = markdown.slice(1, markdown.indexOf('\n')).trim();
      try {
        if (buttonText.disagreeText.length === 0) {
          toast.warn('반대 의견 텍스트를 입력해주세요.');
          return;
        }
        if (buttonText.agreeText.length === 0) {
          toast.warn('찬성 의견 텍스트를 입력해주세요.');
          return;
        }
        if (buttonText.naturalText.length === 0) {
          toast.warn('중립 의견 텍스트를 입력해주세요.');
          return;
        }
        if (title.length === 0) {
          toast.warn('제목을 입력해주세요.');
          return;
        }
        if (
          medias.length > 0 &&
          medias.reduce(
            (acc, cur) => (cur.file ? cur.file.size + acc : acc),
            0,
          ) /
            1000000 >
            100
        ) {
          setIsUpload(false);
          toast.warn('파일 용량이 너무 큽니다.');
          return;
        }
        setIsUpload(true);
        const newState = { ...initialAgoraSchema };
        newState.dto.title = title;
        newState.dto.content = markdownContent;
        newState.dto.agreeText = buttonText.agreeText;
        newState.dto.disagreeText = buttonText.disagreeText;
        newState.dto.naturalText = buttonText.naturalText;
        newState.dto.isAnonymous = anonymousType;

        const formData = new FormData();
        if (medias.length > 0) {
          formData.append('thumbnailFile', medias[0].file as File);
          newState.dto.thumbnail = {
            mediaType: 'image',
          };
          newState.dto.medias = [];
          medias.forEach((media) => {
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
          }),
        );
        await jxios
          .post('/api/agoras', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json',
            },
          })
          .then((res) => {
            if (res.status === 201) {
              toast.success('아고라가 작성되었습니다.');
              push('/agoras');
            }
          })
          .catch((err) => {
            toast.error(err.response.data);
          });
      } catch (err) {
        toast.error((err as string) || '아고라 업로드에 실패했습니다.');
      } finally {
        setIsUpload(false);
      }
    },
    500,
  );

  return (
    <>
      <StandardEditor
        onSubmit={handleCreateSaveButton}
        isUpload={isUpload}
        submitText='아고라 시작'
        headingRequired
        documentHeading={1}
        placeholderText='아고라를 왜 시작하는지 자유롭게 작성해주세요.'
        footer={
          <AnonymousCheckBox
            anonymousType={anonymousType}
            setAnonymousType={setAnonymousType}
          />
        }>
        <div className='flex w-full flex-col gap-2 p-3 md:flex-row'>
          <Input
            label='반대 의견 텍스트'
            placeholder='반대'
            isRequired
            value={buttonText.disagreeText}
            onValueChange={(value) =>
              setButtonText((prev) => {
                return {
                  ...prev,
                  disagreeText: value,
                };
              })
            }
          />
          <Input
            label='중립 의견 텍스트'
            placeholder='고민해봐야'
            isRequired
            value={buttonText.naturalText}
            onValueChange={(value) =>
              setButtonText((prev) => {
                return {
                  ...prev,
                  naturalText: value,
                };
              })
            }
          />
          <Input
            label='찬성 의견 텍스트'
            placeholder='동의'
            isRequired
            value={buttonText.agreeText}
            onValueChange={(value) =>
              setButtonText((prev) => {
                return {
                  ...prev,
                  agreeText: value,
                };
              })
            }
          />
        </div>
      </StandardEditor>
    </>
  );
};

export default NewArtwork;
