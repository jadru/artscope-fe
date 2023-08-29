'use client';

import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react';
import React, { Dispatch, useState } from 'react';
import {
  AiOutlineExpandAlt,
  AiOutlineFullscreenExit,
  AiOutlinePlus,
} from 'react-icons/ai';

type Props = {
  btnText: string;
  title?: string;
  placeholder: string;
  expandBtnText: string;
  reduceBtnText: string;
  cancelBtnText: string;
  submitBtnText: string;
};

type PostType = 'post' | 'artwork' | 'exhibition';

export default function NewPostModal({
  btnText,
  title,
  placeholder,
  expandBtnText,
  reduceBtnText,
  submitBtnText,
  cancelBtnText,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isExpanded, setIsExpanded] = useState(false);
  const [postType, setPostType] = useState<PostType>('post');
  return (
    <>
      <button
        className='w-full rounded-full bg-default-100 px-4 text-left text-sm font-bold text-default-400 transition-colors hover:bg-default-200'
        onClick={() => {
          onOpen();
        }}
      >
        {btnText}
      </button>
      <Modal
        backdrop='blur'
        hideCloseButton
        isDismissable={false}
        isOpen={isOpen}
        onClose={onClose}
        size={isExpanded ? 'full' : 'lg'}
        className={'transition-all' + (isExpanded ? 'duration-300' : '')}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
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
              </ModalHeader>
              <Divider />
              <ModalBody className='justify-between'>
                {placeholder}
                <div className='flex flex-row gap-1'>
                  <button className='h-16 w-16 rounded-md bg-amber-950 shadow-md'></button>
                  <button className='h-16 w-16 rounded-md bg-blue-600 shadow-md'></button>
                  <button className='h-16 w-16 rounded-md bg-yellow-400 shadow-md'></button>
                  <button className='h-16 w-16 rounded-md bg-amber-950 shadow-md'></button>
                  <button className='h-16 w-16 rounded-md bg-blue-600 shadow-md'></button>
                  <button className='h-16 w-16 rounded-md bg-yellow-400 shadow-md'></button>
                  <button className='h-16 w-16 rounded-md bg-amber-950 shadow-md'></button>
                  <button className='h-16 w-16 rounded-md bg-blue-600 shadow-md'></button>
                  <button className='h-16 w-16 rounded-md bg-yellow-400 shadow-md'></button>
                  <button className='h-16 w-16 rounded-md bg-blue-600 shadow-md'></button>
                  <button className='flex h-16 w-16 items-center justify-center rounded-md bg-transparent'>
                    <AiOutlinePlus className='h-8 w-8 text-default-500' />
                  </button>
                </div>
              </ModalBody>
              <Divider />
              <ModalFooter className='justify-between'>
                <div className='flex space-x-2'>
                  <Button
                    startContent={
                      isExpanded ? (
                        <AiOutlineFullscreenExit className='h-5 w-5 text-lg' />
                      ) : (
                        <AiOutlineExpandAlt className='h-5 w-5 text-lg' />
                      )
                    }
                    onClick={() => {
                      setIsExpanded(!isExpanded);
                    }}
                  >
                    {isExpanded ? reduceBtnText : expandBtnText}
                  </Button>

                  <PostTypeCheckBox
                    postType={postType}
                    setPostType={setPostType}
                  />
                </div>
                <div className='space-x-2'>
                  <Button color='warning' variant='flat' onPress={onClose}>
                    {cancelBtnText}
                  </Button>
                  <Button color='secondary' variant='flat' onPress={onClose}>
                    {submitBtnText}
                  </Button>
                </div>
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
  { label: '전시', value: 'exhibition' },
];

const PostTypeCheckBox = ({
  setPostType,
}: {
  postType: PostType;
  setPostType: Dispatch<PostType>;
}) => (
  <Select
    labelPlacement='outside'
    color='secondary'
    defaultSelectedKeys={['post']}
    className='w-[150px]'
    onChange={(e) => {
      if (!e.target.value) return;
      setPostType(e.target.value as PostType);
    }}
  >
    {PostTypeSelectItems.map((item) => (
      <SelectItem key={item.value}>{item.label}</SelectItem>
    ))}
  </Select>
);
