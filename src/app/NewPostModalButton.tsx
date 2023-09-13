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
  ScrollShadow,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React, { Dispatch, useState } from 'react';
import {
  AiFillCloseCircle,
  AiOutlineClose,
  AiOutlineExpandAlt,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineFullscreenExit,
  AiOutlinePlus,
} from 'react-icons/ai';
import { FaHashtag } from 'react-icons/fa';
import TextareaAutoSize from 'react-textarea-autosize';
import { toast } from 'react-toastify';

import UserInfo from '@/app/UserInfo';
import jxios from '@/utils/jxios';

type Props = {
  title?: string;
  placeholder: string;
  submitBtnText: string;
};

type TopicType = 'post' | 'artwork' | 'exhibition';
type PublicType = 'public' | 'private';

type ImageType = {
  id: number;
  url: string;
};

export default function NewPostModal({
  title,
  placeholder,
  submitBtnText,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { refetch } = useInfiniteQuery(['feed']);
  const [isExpanded, setIsExpanded] = useState(false);
  const [postType, setPostType] = useState<TopicType>('post');
  const [publicType, setPublicType] = useState<PublicType>('public');
  const [imageCount] = useState<ImageType[]>([
    {
      id: 1,
      url: 'https://picsum.photos/50',
    },
  ]);
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
        size={isExpanded ? 'full' : 'lg'}
        className={'transition-all' + (isExpanded ? 'duration-300' : '')}
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
                <p className='text-center'>
                  {title
                    ? title
                    : `새 ${
                        postType === 'post'
                          ? '포스트'
                          : postType === 'artwork'
                          ? '작품'
                          : '전시'
                      } 작성하기`}
                </p>
                <button onClick={onClose}>
                  <AiOutlineClose className='h-6 w-6 hover:text-blue-600' />
                </button>
              </ModalHeader>
              <Divider />
              <ModalBody className='items-start justify-between'>
                <div className='w-full overflow-y-scroll'>
                  <div className='flex flex-row gap-2'>
                    <UserInfo />
                    <PublicTypeCheckBox
                      publicType={publicType}
                      setPublicType={setPublicType}
                    />
                  </div>
                  <ScrollShadow className='max-h-max'>
                    <TextareaAutoSize
                      defaultValue={postContent}
                      autoFocus
                      placeholder={placeholder}
                      minRows={isExpanded ? undefined : 2}
                      maxRows={isExpanded ? undefined : 10}
                      className='min-h-12 mt-1 w-full resize-none !border-0 px-0 text-lg focus:border-none focus:shadow-none focus:shadow-transparent focus:ring-0'
                      onChange={(e) => {
                        setPostContent(e.currentTarget.value);
                      }}
                      onFocus={(e) => {
                        const val = e.target.value;
                        e.target.value = '';
                        e.target.value = val;
                      }}
                    />
                  </ScrollShadow>
                </div>
                <div className='gap-1'>
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
                        onKeyDown={(event) => {
                          if (
                            event.key === 'Enter' &&
                            !event.nativeEvent.isComposing
                          ) {
                            handleAddTag(event.currentTarget.value);
                            event.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className='flex flex-row gap-1'>
                    {imageCount &&
                      imageCount.map((image, index) => (
                        <>
                          <div
                            key={image.id}
                            className={`group relative h-[76px] w-[76px] ${
                              index === 0 ? 'ml-0' : '-ml-2'
                            }`}
                          >
                            <Image
                              key={image.id + '_image'}
                              src={image.url}
                              width={64}
                              height={64}
                              alt='image'
                              className='absolute bottom-0 left-0 h-16 w-16 rounded-md bg-gray-600'
                            />
                            <button
                              key={image.id + '_delete'}
                              className='invisible absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white text-red-600 shadow-md hover:text-amber-700 group-hover:visible'
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
                        <button className='absolute bottom-0 left-0 flex h-16 w-16 items-center justify-center rounded-md border-2 border-dotted bg-transparent'>
                          <AiOutlinePlus className='h-6 w-6 text-gray-400' />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </ModalBody>
              <Divider />
              <ModalFooter className='flex-col justify-around sm:flex-row'>
                <PostTypeCheckBox
                  postType={postType}
                  setPostType={setPostType}
                />
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

const PostTypeSelectItems = [
  { label: '포스트', value: 'post' },
  { label: '작품', value: 'artwork' },
  { label: '전시회', value: 'exhibition' },
];

const PublicTypeSelectItems = [
  { label: '전체 공개', value: 'public', icon: <AiOutlineEye /> },
  { label: '나만 보기', value: 'private', icon: <AiOutlineEyeInvisible /> },
];

const PostTypeCheckBox = ({
  setPostType,
}: {
  postType: TopicType;
  setPostType: Dispatch<TopicType>;
}) => (
  <Select
    labelPlacement='outside'
    color='secondary'
    disallowEmptySelection
    defaultSelectedKeys={['post']}
    description='토픽 선택'
    className='mb-1.5 w-[200px]'
    onChange={(e) => {
      setPostType(e.target.value as TopicType);
    }}
  >
    {PostTypeSelectItems.map((item) => (
      <SelectItem key={item.value}>{item.label}</SelectItem>
    ))}
  </Select>
);

const PublicTypeCheckBox = ({
  setPublicType,
  publicType,
}: {
  publicType: PublicType;
  setPublicType: Dispatch<PublicType>;
}) => (
  <Select
    labelPlacement='outside'
    size='sm'
    color='primary'
    disallowEmptySelection
    startContent={
      publicType === 'public' ? <AiOutlineEye /> : <AiOutlineEyeInvisible />
    }
    defaultSelectedKeys={['public']}
    className='mb-1.5 w-[130px]'
    onChange={(e) => {
      setPublicType(e.target.value as PublicType);
    }}
  >
    {PublicTypeSelectItems.map((item) => (
      <SelectItem key={item.value} startContent={item.icon}>
        {item.label}
      </SelectItem>
    ))}
  </Select>
);
