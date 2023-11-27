'use client';

import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import {
  AiOutlineClose,
  AiOutlineExpandAlt,
  AiOutlineFullscreenExit,
} from 'react-icons/ai';
import { toast } from 'react-toastify';

import getVideoCoverFromLocal from '@/components/New/Artworks/getVideoCoverFromLocal';
import { initialArtWork } from '@/components/New/Artworks/initialArtworkSchema';
import NewArtworkForm from '@/components/New/Artworks/NewArtworkForm';
import { PublicType } from '@/components/New/Artworks/PublicTypeCheckBox';
import NewMediaView from '@/components/New/Media/NewMediaView';
import NewTagView from '@/components/New/Tag/NewTagView';

import jxios from '@/utils/jxios';

import { ArtWorkMediaType } from '@/types/artwork';

type Props = {
  placeholder: string;
  submitBtnText: string;
  refetch: () => void;
  isOpen: boolean;
  onClose: () => void;
};

export default function NewArtworkModal({
  placeholder,
  submitBtnText,
  refetch,
  isOpen,
  onClose,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [publicType, setPublicType] = useState<PublicType>('public');
  const [fileUrls, setFileUrls] = useState<ArtWorkMediaType[]>([]);
  const [imgs, setImgs] = useState<string[]>([]);
  const [isUpload, setIsUpload] = useState(false);
  const [tagCount, setTagCount] = useState<string[]>([]);
  const [postContent, setPostContent] = useState<string>('');
  const [postTitle, setPostTitle] = useState<string>('');

  const preventGoBack = () => {
    history.pushState(null, '', location.href);
  };

  useEffect(() => {
    history.pushState(null, '', location.href);
    window.addEventListener('popstate', preventGoBack);

    return () => {
      window.removeEventListener('popstate', preventGoBack);
    };
  }, []);

  useEffect(() => {
    if (
      isOpen &&
      (fileUrls.length !== 0 ||
        postContent.length !== 0 ||
        postTitle.length !== 0 ||
        tagCount.length !== 0)
    ) {
      preventGoBack();
    }
  }, [imgs, isOpen, postContent, postTitle, publicType, tagCount, fileUrls]);

  const handleCreateSaveButton = async () => {
    if (isUpload) return;
    try {
      if (fileUrls.length === 0) {
        toast.warn('파일을 업로드해주세요.');
        return;
      }
      if (postTitle.length === 0) {
        toast.warn('제목을 입력해주세요.');
        return;
      }
      if (postContent.length === 0) {
        toast.warn('내용을 입력해주세요.');
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
      const newState = { ...initialArtWork };
      newState.dto.title = postTitle;
      newState.dto.description = postContent;
      newState.dto.tags = tagCount;
      newState.dto.visible = publicType === 'public';

      const formData = new FormData();
      if (fileUrls[0].mediaType === 'video') {
        const cover = (await getVideoCoverFromLocal(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          fileUrls[thumbnail].file,
          1.5
        )) as Blob;
        formData.append(
          'thumbnailFile',
          new File([cover], 'thumbnail.jpg', { type: 'image/jpeg' })
        );
      } else if (fileUrls[0].mediaType === 'image') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        formData.append('thumbnailFile', fileUrls[0].file);
      } else {
        fileUrls[0].linkUrl &&
          formData.append(
            'thumbnailFile',
            await fetch(
              'https://img.youtube.com/vi/' +
                fileUrls[0].linkUrl.substring(
                  fileUrls[0].linkUrl.indexOf('=') + 1
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
      fileUrls.forEach((media) => {
        media.mediaType === 'url'
          ? formData.append(
              'mediaFiles',
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              new File([media.linkUrl], 'mediaFiles', {
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
        new Blob([JSON.stringify(newState.dto)], { type: 'application/json' })
      );
      await jxios
        .post('/api/artworks', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        })
        .then((res) => {
          resetAfterUpload();
          if (res.status === 201) {
            toast.success('작품이 업로드되었습니다.');
            refetch();
            onClose();
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
  };

  const resetAfterUpload = () => {
    setFileUrls([]);
    setImgs([]);
    setTagCount([]);
    setPostContent('');
    setPostTitle('');
  };

  return (
    <Modal
      backdrop='blur'
      hideCloseButton
      isOpen={isOpen}
      onClose={() => {
        confirm(
          '작품 업로드를 취소하시겠습니까? 작업 내용이 저장되지 않을 수도 있습니다.'
        ) && onClose();
      }}
      size={isExpanded ? 'full' : 'xl'}
      className='!max-h-screen transition-all duration-100'
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-row items-center justify-between gap-1'>
              <button
                onClick={() => {
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? (
                  <AiOutlineFullscreenExit className='h-6 w-6 text-lg hover:text-blue-600' />
                ) : (
                  <AiOutlineExpandAlt className='h-6 w-6 text-lg hover:text-blue-600' />
                )}
              </button>
              <p className='text-center'>새 작품 업로드하기</p>
              <button onClick={onClose}>
                <AiOutlineClose className='h-6 w-6 hover:text-blue-600' />
              </button>
            </ModalHeader>
            <Divider />
            <ModalBody className='max-h-[88%] items-start justify-between'>
              <div className='w-full overflow-y-scroll'>
                <NewArtworkForm
                  postTitle={postTitle}
                  setPostTitle={setPostTitle}
                  postContent={postContent}
                  setPostContent={setPostContent}
                  publicType={publicType}
                  setPublicType={setPublicType}
                  isExpanded={isExpanded}
                  placeholder={placeholder}
                />
              </div>
              <div className='max-w-full gap-1'>
                <NewTagView tagCount={tagCount} setTagCount={setTagCount} />
                <NewMediaView
                  fileUrls={fileUrls}
                  setFileUrls={setFileUrls}
                  setImgs={setImgs}
                  imgs={imgs}
                />
              </div>
            </ModalBody>
            <Divider />
            <ModalFooter className='flex-col justify-around sm:flex-row'>
              <Button
                color='secondary'
                variant='flat'
                onPress={handleCreateSaveButton}
                disabled={isUpload}
                isLoading={isUpload}
                fullWidth
              >
                {submitBtnText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
