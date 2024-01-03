'use client';

import { useDebounce } from '@toss/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import '@/styles/editor.scss';

import getVideoCoverFromLocal from '@/components/New/Artworks/getVideoCoverFromLocal';
import { initialArtWork } from '@/components/New/Artworks/initialArtworkSchema';
import PublicTypeCheckBox, {
  PublicType,
} from '@/components/New/Artworks/PublicTypeCheckBox';
import NewTagView from '@/components/New/Tag/NewTagView';
import StandardEditor from '@/components/StandardEditor';

import jxios from '@/utils/jxios';

import { ArtWorkMediaType } from '@/types/artwork';

const NewArtwork = () => {
  const [tagCount, setTagCount] = useState<string[]>([]);
  const { push } = useRouter();
  const [isUpload, setIsUpload] = useState(false);
  const [publicType, setPublicType] = useState<PublicType>('public');

  const handleCreateSaveButton = useDebounce(
    async (markdown: string, medias: ArtWorkMediaType[]) => {
      if (isUpload) return;
      const markdownContent = markdown.slice(markdown.indexOf('\n') + 1);
      try {
        if (medias.length === 0) {
          toast.warn('이미지, 영상 또는 썸네일을 업로드해주세요.');
          return;
        }
        if (markdown.slice(1, markdown.indexOf('\n')).trim().length === 0) {
          toast.warn('제목을 입력해주세요.');
          return;
        }
        if (
          medias.reduce(
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
        const newState = { ...initialArtWork };
        newState.dto.title = markdown.slice(1, markdown.indexOf('\n')).trim();
        newState.dto.description = markdownContent.slice(
          markdownContent.indexOf('\n') + 2
        );
        newState.dto.tags = tagCount;
        newState.dto.visible = publicType === 'public';

        const formData = new FormData();
        if (medias[0].mediaType === 'video') {
          const cover = (await getVideoCoverFromLocal(
            medias[0].file as File,
            1.5
          )) as Blob;
          formData.append(
            'thumbnailFile',
            new File([cover], 'thumbnail.jpg', { type: 'image/jpeg' })
          );
        } else if (medias[0].mediaType === 'image') {
          formData.append('thumbnailFile', medias[0].file as File);
        } else {
          medias[0].linkUrl &&
            formData.append(
              'thumbnailFile',
              await fetch(
                'https://img.youtube.com/vi/' +
                  medias[0].linkUrl.substring(
                    medias[0].linkUrl.indexOf('=') + 1
                  ) +
                  '/maxresdefault.jpg',
                {
                  mode: 'no-cors',
                  headers: {
                    'Access-Control-Allow-Origin': '*',
                    Accept: '*/*',
                    'Content-Type': 'image/jpeg',
                  },
                }
              ).then((res) => res.blob()),
              'yt_thumbnail.jpg'
            );
        }
        newState.dto.medias = [];
        medias.forEach((media) => {
          media.mediaType === 'url'
            ? formData.append(
                'mediaFiles',
                new File([media.linkUrl as string], 'mediaFiles', {
                  type: 'text/plain',
                })
              )
            : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              formData.append('mediaFiles', media.file);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          newState.dto.medias.push({
            mediaType: media.mediaType,
            description: media.description,
          });
        });
        formData.append(
          'dto',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          new Blob([JSON.stringify(newState.dto)], {
            type: 'application/json',
          })
        );
        await jxios
          .post('/api/artworks', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json',
            },
          })
          .then((res) => {
            if (res.status === 201) {
              toast.success('작품이 업로드되었습니다.');
              push('/artworks');
            }
          })
          .catch((err) => {
            toast.error(err.response.data);
          });
      } catch (err) {
        toast.error((err as string) || '작품 업로드에 실패했습니다.');
      } finally {
        setIsUpload(false);
      }
    },
    500
  );

  return (
    <StandardEditor
      onSubmit={handleCreateSaveButton}
      isUpload={isUpload}
      submitText='작품 업로드'
      headingRequired
      documentHeading={1}
      isDraggableMedia
      mediaFileRequired
      placeholderText='작품에 대한 설명을 자유롭게 작성해주세요.'
      footer={
        <PublicTypeCheckBox
          publicType={publicType}
          setPublicType={setPublicType}
        />
      }>
      <NewTagView tagCount={tagCount} setTagCount={setTagCount} />
    </StandardEditor>
  );
};

export default NewArtwork;
