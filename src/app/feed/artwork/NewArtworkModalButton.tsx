'use client';

import {
  Button,
  Chip,
  Divider,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useState } from 'react';
import {
  AiFillCloseCircle,
  AiOutlineClose,
  AiOutlineExpandAlt,
  AiOutlineFullscreenExit,
  AiOutlinePlus,
} from 'react-icons/ai';
import { FaHashtag } from 'react-icons/fa';
import TextareaAutoSize from 'react-textarea-autosize';
import { toast } from 'react-toastify';

import PublicTypeCheckBox, {
  PublicType,
} from '@/app/feed/artwork/PublicTypeCheckBox';
import UserInfo from '@/app/UserInfo';
import jxios from '@/utils/jxios';

type Props = {
  placeholder: string;
  submitBtnText: string;
};

type ImageType = {
  file: File;
  url: string;
};

export default function NewPostModal({ placeholder, submitBtnText }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { refetch } = useInfiniteQuery(['feed']);
  const [isExpanded, setIsExpanded] = useState(false);
  const [publicType, setPublicType] = useState<PublicType>('public');
  const [imageCount, setImageCount] = useState<ImageType[]>([]);
  const [tagCount, setTagCount] = useState<string[]>([]);
  const [postContent, setPostContent] = useState<string>('');
  const [postTitle, setPostTitle] = useState<string>('');
  const handleAddTag = (tag: string) => {
    if (tag === '') return;
    tagCount.length === 0
      ? setTagCount([tag])
      : tagCount.filter((item) => item !== tag).length === tagCount.length
      ? setTagCount([...tagCount, tag])
      : '';
  };

  const handleSubmit = async () => {
    if (postContent.length < 10) {
      toast('10자 이상 입력해주세요.');
      return;
    }
    onClose();
    await jxios
      .post('/api/post', {
        title: postTitle !== '' ? postTitle : postContent.slice(0, 10),
        content: postContent,
      })
      .then(() => toast.success('작성되었습니다.'));
    setPostContent('');
    setPostTitle('');
    await refetch();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (imageCount.length + files.length > 10) {
        toast.warn('10개 이상 업로드할 수 없습니다.');
        return;
      }
      const filesArray = Array.from(files);
      setImageCount((prev) => {
        return [
          ...prev,
          ...filesArray.map((file) => {
            return { file, url: URL.createObjectURL(file) };
          }),
        ];
      });
    }
  };

  const handleDelete = (url: string) => {
    setImageCount(imageCount.filter((image) => image.url !== url));
  };

  return (
    <>
      <button
        className='w-full truncate rounded-full bg-default-100 px-4 text-left text-sm font-bold text-default-400 transition-colors hover:bg-default-200'
        onClick={() => {
          onOpen();
        }}
      >
        {postContent.length === 0
          ? placeholder
          : postTitle.length === 0
          ? postContent
          : postTitle}
      </button>
      <Modal
        backdrop='blur'
        hideCloseButton
        isOpen={isOpen}
        onClose={onClose}
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
                  <div className='flex flex-row gap-2'>
                    <UserInfo />
                    <PublicTypeCheckBox
                      publicType={publicType}
                      setPublicType={setPublicType}
                    />
                  </div>
                  <TextareaAutoSize
                    defaultValue={postContent}
                    autoFocus
                    placeholder={placeholder}
                    minRows={isExpanded ? undefined : 5}
                    maxRows={isExpanded ? undefined : 12}
                    className='min-h-12 mt-1 max-h-[90%] w-full resize-none !border-0 px-0 text-lg focus:border-none focus:shadow-none focus:shadow-transparent focus:ring-0'
                    onChange={(e) => {
                      setPostContent(e.currentTarget.value);
                    }}
                    onFocus={(e) => {
                      const val = e.target.value;
                      e.target.value = '';
                      e.target.value = val;
                    }}
                  />
                </div>
                <div className='max-w-full gap-1'>
                  <div className='flex flex-wrap'>
                    {tagCount &&
                      tagCount.map((item) => (
                        <Chip
                          onClose={() => {
                            setTagCount(tagCount.filter((tag) => tag !== item));
                          }}
                          className='m-1 h-8'
                          size='lg'
                          key={item}
                          startContent={<FaHashtag />}
                        >
                          {item}
                        </Chip>
                      ))}
                    <div className='relative m-1 h-8 w-36 rounded-full bg-gray-100'>
                      <FaHashtag className='absolute bottom-auto left-2 top-1/2 -translate-y-1/2' />
                      <Kbd
                        keys={['enter']}
                        className='absolute bottom-auto right-2 top-1/2 -translate-y-1/2'
                      ></Kbd>
                      <input
                        className='m-1 ml-5 h-6 max-h-6 w-24 rounded-full !border-0 bg-transparent p-2 focus:border-none focus:shadow-none focus:shadow-transparent focus:ring-0'
                        placeholder='태그 추가'
                        onKeyDown={(e) => {
                          e.preventDefault();
                          if (
                            (e.key === 'Enter' ||
                              e.key == ' ' ||
                              e.code == 'Space') &&
                            !e.nativeEvent.isComposing
                          ) {
                            handleAddTag(
                              e.currentTarget.value.replace(/ /g, '')
                            );
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className='flex flex-wrap gap-1'>
                    {imageCount &&
                      imageCount.map((image) => (
                        <>
                          <div
                            key={image.url}
                            className='relative h-[76px] w-[76px]'
                          >
                            <Image
                              src={image.url}
                              width={64}
                              height={64}
                              alt='image'
                              className='absolute bottom-0 left-0 h-16 w-16 rounded-md bg-gray-600'
                            />

                            <button
                              className='absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white text-red-600 shadow-md hover:text-amber-700'
                              onClick={() => handleDelete(image.url)}
                            >
                              <AiFillCloseCircle className='h-6 w-6 rounded-full border border-white' />
                            </button>
                          </div>
                        </>
                      ))}

                    {imageCount.length < 10 && (
                      <div
                        key='plus'
                        className='relative -ml-2 h-[76px] w-[60px]'
                      >
                        <label
                          htmlFor='uploads'
                          className='absolute bottom-0 left-0 flex h-16 w-16 cursor-pointer items-center justify-center rounded-md border-2 border-dotted bg-transparent'
                        >
                          <AiOutlinePlus className='h-6 w-6 text-gray-400' />
                        </label>
                      </div>
                    )}

                    <input
                      id='uploads'
                      type='file'
                      multiple
                      accept={'image/*,video/*,audio/*'}
                      className='invisible'
                      onChange={handleUpload}
                    />
                  </div>
                </div>
              </ModalBody>
              <Divider />
              <ModalFooter className='flex-col justify-around sm:flex-row'>
                <Button
                  color='secondary'
                  variant='flat'
                  onPress={handleSubmit}
                  fullWidth
                >
                  {submitBtnText}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
