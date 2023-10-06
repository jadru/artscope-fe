'use client';
/* eslint-disable */
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  useDisclosure,
} from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import TextareaAutoSize from 'react-textarea-autosize';
import { toast } from 'react-toastify';

import { TopicType } from '@/app/post/TopicTypeCheckBox';
import UserInfo from '@/app/UserInfo';
import jxios from '@/utils/jxios';
import {
  DebounceClick,
  useCallbackOnce,
  useDebounce,
  useTimeout,
} from '@toss/react';
import { delay } from '@toss/utils';

type Props = {
  placeholder: string;
  submitBtnText: string;
};

type ImageType = {
  id: number;
  url: string;
};

export default function NewPostModal({ placeholder, submitBtnText }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { refetch } = useInfiniteQuery(['feed']);
  const [postType, setPostType] = useState<TopicType>('default');
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [imageCount] = useState<ImageType[]>([]);
  const [tagCount, setTagCount] = useState<string[]>([]);
  const [postContent, setPostContent] = useState<string>('');
  const handleAddTag = (tag: string) => {
    if (tag === '') return;
    tagCount.length === 0
      ? setTagCount([tag])
      : tagCount.filter((item) => item !== tag).length === tagCount.length
      ? setTagCount([...tagCount, tag])
      : '';
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSubmit = useDebounce(() => {
    if (postContent.length < 10) {
      toast('10자 이상 입력해주세요.');
      return;
    }
    setIsSubmit(true);
    onClose();
    jxios
      .post('/api/post', {
        title: '',
        content: postContent,
      })
      .then(async () => {
        toast.success('작성되었습니다.');
        await delay(500);
        await refetch();
      })
      .finally(() => {
        setIsSubmit(false);
      });
    setPostContent('');
  }, 500);

  return (
    <>
      <button
        className='w-full truncate rounded-full bg-default-100 px-4 text-left text-sm font-bold text-default-400 transition-colors hover:bg-default-200'
        onClick={() => {
          onOpen();
        }}
      >
        {postContent.length === 0 ? placeholder : postContent}
      </button>
      <Modal
        backdrop='blur'
        hideCloseButton
        isOpen={isOpen}
        onClose={onClose}
        size='xl'
        className='transition-all'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-row items-center justify-between gap-1'>
                <p className='text-center'>새 포스트 작성하기</p>
                <button onClick={onClose}>
                  <AiOutlineClose className='h-6 w-6 hover:text-blue-600' />
                </button>
              </ModalHeader>
              <Divider />
              <ModalBody className='items-start justify-between'>
                <div className='w-full overflow-y-scroll'>
                  <div className='flex flex-row gap-2'>
                    <UserInfo />
                  </div>
                  <ScrollShadow className='max-h-max'>
                    <TextareaAutoSize
                      defaultValue={postContent}
                      autoFocus
                      placeholder={placeholder}
                      minRows={4}
                      maxRows={10}
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
                {/* <div className='gap-1'> */}
                {/*   <div className='flex flex-wrap'> */}
                {/*     {tagCount && */}
                {/*       tagCount.map((item) => ( */}
                {/*         <Chip */}
                {/*           onClose={() => { */}
                {/*             setTagCount(tagCount.filter((tag) => tag !== item)); */}
                {/*           }} */}
                {/*           className='m-1 h-8' */}
                {/*           size='lg' */}
                {/*           key={item} */}
                {/*           startContent={<FaHashtag />} */}
                {/*         > */}
                {/*           {item} */}
                {/*         </Chip> */}
                {/*       ))} */}
                {/*     <div className='relative m-1 h-8 w-36 rounded-full bg-gray-100'> */}
                {/*       <FaHashtag className='absolute bottom-auto left-2 top-1/2 -translate-y-1/2' /> */}
                {/*       <Kbd */}
                {/*         keys={['enter']} */}
                {/*         className='absolute bottom-auto right-2 top-1/2 -translate-y-1/2' */}
                {/*       ></Kbd> */}
                {/*       <input */}
                {/*         className='m-1 ml-5 h-6 max-h-6 w-24 rounded-full !border-0 bg-transparent p-2 focus:border-none focus:shadow-none focus:shadow-transparent focus:ring-0' */}
                {/*         placeholder='태그 추가' */}
                {/*         onKeyDown={(event) => { */}
                {/*           if ( */}
                {/*             event.key === 'Enter' && */}
                {/*             !event.nativeEvent.isComposing */}
                {/*           ) { */}
                {/*             handleAddTag(event.currentTarget.value); */}
                {/*             event.currentTarget.value = ''; */}
                {/*           } */}
                {/*         }} */}
                {/*       /> */}
                {/*     </div> */}
                {/*   </div> */}
                {/*   <div className='flex flex-row gap-1'> */}
                {/*     {imageCount && */}
                {/*       imageCount.map((image, index) => ( */}
                {/*         <> */}
                {/*           <div */}
                {/*             key={image.id} */}
                {/*             className={`group relative h-[76px] w-[76px] ${ */}
                {/*               index === 0 ? 'ml-0' : '-ml-2' */}
                {/*             }`} */}
                {/*           > */}
                {/*             <Image */}
                {/*               key={image.id + '_image'} */}
                {/*               src={image.url} */}
                {/*               width={64} */}
                {/*               height={64} */}
                {/*               alt='image' */}
                {/*               className='absolute bottom-0 left-0 h-16 w-16 rounded-md bg-gray-600' */}
                {/*             /> */}
                {/*             <button */}
                {/*               key={image.id + '_delete'} */}
                {/*               className='invisible absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white text-red-600 shadow-md hover:text-amber-700 group-hover:visible' */}
                {/*             > */}
                {/*               <AiFillCloseCircle className='h-6 w-6 rounded-full border border-white' /> */}
                {/*             </button> */}
                {/*           </div> */}
                {/*         </> */}
                {/*       ))} */}
                {/*     {imageCount.length < 10 && ( */}
                {/*       <div */}
                {/*         key='plus' */}
                {/*         className='relative -ml-2 h-[76px] w-[60px]' */}
                {/*       > */}
                {/*         <button className='absolute bottom-0 left-0 flex h-16 w-16 items-center justify-center rounded-md border-2 border-dotted bg-transparent'> */}
                {/*           <AiOutlinePlus className='h-6 w-6 text-gray-400' /> */}
                {/*         </button> */}
                {/*       </div> */}
                {/*     )} */}
                {/*   </div> */}
                {/* </div> */}
              </ModalBody>
              <Divider />
              <ModalFooter className='flex-col justify-around sm:flex-row'>
                {/* <TopicTypeCheckBox */}
                {/*   postType={postType} */}
                {/*   setPostType={setPostType} */}
                {/* /> */}
                <Button
                  color='secondary'
                  variant='flat'
                  onPress={handleSubmit}
                  isLoading={isSubmit}
                  disabled={isSubmit}
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
