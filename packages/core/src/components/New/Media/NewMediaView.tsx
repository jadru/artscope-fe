'use client';

import {
  Input,
  Kbd,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import React, { useState } from 'react';
import { AiFillCloseCircle, AiOutlinePlus } from 'react-icons/ai';
import { BiImage } from 'react-icons/bi';
import { toast } from 'react-toastify';

import ASNextImage from '@/components/ASNextImage';

import { ArtWorkMediaType } from '@/types/artwork';

type Props = {
  fileUrls: ArtWorkMediaType[];
  setFileUrls: React.Dispatch<React.SetStateAction<ArtWorkMediaType[]>>;
  onlyImage?: boolean;
  header?: string;
};

export default ({ setFileUrls, fileUrls, onlyImage, header }: Props) => {
  const [uploadPopoverOpen, setUploadPopoverOpen] = useState(false);
  const [imgs, setImgs] = useState<string[]>([]);
  const handleFileAdded = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.currentTarget.files &&
      fileUrls.length + e.currentTarget.files?.length > 10
    ) {
      toast.warn('10개 이하의 파일까지 업로드할 수 있습니다.');
      return;
    }
    if (e.currentTarget.files?.length === 0) return;

    const files = e.currentTarget.files as FileList;
    for (let i = 0; i < files.length; i++) {
      setImgs((prev) => [...prev, URL.createObjectURL(files[i])]);
      setFileUrls((prev) => [
        ...prev,
        {
          mediaType: files[i].type.startsWith('image')
            ? 'image'
            : files[i].type.startsWith('video')
            ? 'video'
            : 'audio',
          file: files[i],
          description: '',
        },
      ]);
    }
    setUploadPopoverOpen(false);
  };

  const handleLinkAdded = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (onlyImage) return;

    if (fileUrls.length + 1 > 10) {
      toast.warn('10개 이하의 파일까지 업로드할 수 있습니다.');
      return;
    }
    let link = e.currentTarget.value;

    if (
      link.startsWith('https://www.youtube.com/watch?v=') ||
      link.startsWith('http://www.youtube.com/watch?v=')
    ) {
      /* empty */
    } else if (link.startsWith('https://youtu.be/')) {
      link = link.replace(
        'https://youtu.be/',
        'https://www.youtube.com/watch?v=',
      );
    } else {
      alert('유튜브 링크를 입력해주세요');
      return;
    }

    setFileUrls((prev: ArtWorkMediaType[]) => [
      ...prev,
      {
        mediaType: 'url',
        linkUrl: link,
        description: '',
      },
    ]);
    setImgs((prev) => [...prev, link]);
    e.currentTarget.value = '';
    setUploadPopoverOpen(false);
  };

  const handleDeleteFile = (index: number) => {
    if (confirm('미디어를 삭제하시겠습니까?')) {
      setImgs((prev) => prev.filter((_, i) => i !== index));
      setFileUrls((prev: ArtWorkMediaType[]) =>
        prev.filter((_, i) => i !== index),
      );
    }
  };

  return (
    <div className='flex w-full flex-col gap-2 rounded-2xl border-2 px-3 pb-4 pt-3'>
      <p className='-mb-2 text-lg font-bold'>
        <BiImage className='mb-0.5 mr-1 inline' size={20} />
        {header || '미디어 첨부'} {fileUrls.length}/10
      </p>
      {!onlyImage && (
        <p className='text-sm text-gray-500'>
          하나 이상의 이미지, 동영상을 업로드해야 합니다.
        </p>
      )}
      <div className='flex flex-wrap gap-1'>
        {fileUrls.length > 0 &&
          fileUrls.map(
            (file, index) =>
              fileUrls && (
                <div
                  key={file.mediaType + index}
                  className='relative h-[76px] w-[76px]'>
                  {file.mediaType === 'image' ? (
                    <ASNextImage
                      src={imgs[index]}
                      width={64}
                      height={64}
                      alt='image'
                      className='absolute bottom-0 left-0 h-16 w-16 rounded-md border bg-gray-100 object-cover'
                    />
                  ) : file.mediaType === 'video' ? (
                    <video
                      className='absolute bottom-0 left-0 h-16 w-16 rounded-md border bg-gray-100 object-cover'
                      src={imgs[index]}
                    />
                  ) : file.mediaType === 'audio' ? (
                    <div className='absolute bottom-0 left-0 h-16 w-16 rounded-md border bg-gray-100'>
                      <p className='text-2xl font-extrabold'>AUDIO</p>
                    </div>
                  ) : (
                    <ASNextImage
                      className='absolute bottom-0 left-0 h-16 w-16 rounded-md border bg-gray-100 object-cover'
                      src={
                        imgs[index]
                          ? 'https://img.youtube.com/vi/' +
                            imgs[index].substring(
                              imgs[index].indexOf('=') + 1,
                            ) +
                            '/default.jpg'
                          : imgs[index]
                      }
                      alt={'uploaded image ' + index}
                      width={64}
                      height={64}
                    />
                  )}
                  <button
                    className='absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white text-red-600 shadow-md hover:text-amber-700'
                    onClick={() => handleDeleteFile(index)}>
                    <AiFillCloseCircle className='h-6 w-6 rounded-full border border-white' />
                  </button>
                </div>
              ),
          )}

        {imgs.length < 10 && (
          <Popover
            placement='bottom'
            offset={20}
            showArrow
            isOpen={uploadPopoverOpen}
            onOpenChange={(open) => setUploadPopoverOpen(open)}>
            <PopoverTrigger>
              <div key='plus' className='relative h-[76px] w-[60px]'>
                <button className='absolute bottom-0 left-0 flex h-16 w-16 cursor-pointer items-center justify-center rounded-md border-2 border-dotted bg-transparent'>
                  <AiOutlinePlus className='h-6 w-6 text-gray-400' />
                </button>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <div className='my-2 flex flex-col gap-2'>
                <label
                  htmlFor='uploads'
                  className='text-md bg-primary hover:bg-primary-700 flex h-10 cursor-pointer items-center justify-center rounded-xl px-8 text-center font-bold text-white transition-colors'>
                  업로드
                </label>
                {!onlyImage && (
                  <Input
                    id='urls'
                    type='url'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (fileUrls.length === 0) {
                          toast.warn(
                            '첫번째 파일은 썸네일이므로, 이미지나 동영상을 업로드해주세요.',
                          );
                          return;
                        }
                        handleLinkAdded(e);
                        e.currentTarget.value = '';
                      }
                    }}
                    placeholder='유튜브 링크 https://...'
                    endContent={<Kbd keys='enter'>Enter</Kbd>}
                  />
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}

        <input
          id='uploads'
          type='file'
          multiple
          accept={'image/*' + (onlyImage ? '' : ',video/*,audio/*')}
          className='hidden'
          onChange={handleFileAdded}
        />
      </div>
    </div>
  );
};
