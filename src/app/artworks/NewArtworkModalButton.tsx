'use client';

import {
  Button,
  Chip,
  Divider,
  Input,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
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

import ASNextImage from '@/components/ASNextImage';

import PublicTypeCheckBox, {
  PublicType,
} from '@/app/artworks/PublicTypeCheckBox';
import UserInfo from '@/app/UserInfo';
import jxios from '@/utils/jxios';

import { ArtWorkApiRequestType, ArtWorkMediaType } from '@/types/artwork';

type Props = {
  placeholder: string;
  submitBtnText: string;
};

const initialArtWork: ArtWorkApiRequestType = {
  dto: {
    title: '',
    description: '',
    visible: true,
    tags: [],
    medias: [],
    thumbnail: { mediaType: 'image', description: '' },
  },
  mediaFiles: [],
  thumbnailFile: undefined,
};

export default function NewArtworkModal({ placeholder, submitBtnText }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { refetch } = useInfiniteQuery(['artworks']);
  const [isExpanded, setIsExpanded] = useState(false);
  const [publicType, setPublicType] = useState<PublicType>('public');
  const [fileUrls, setFileUrls] = useState<ArtWorkMediaType[]>([]);
  const [imgs, setImgs] = useState<string[]>([]);
  const [isUpload, setIsUpload] = useState(false);
  const [tagCount, setTagCount] = useState<string[]>([]);
  const [postContent, setPostContent] = useState<string>('');
  const [postTitle, setPostTitle] = useState<string>('');

  const regExp = /[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/ ]/gim;

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

  const handleAddTag = (tag: string) => {
    if (tag === '') return;
    tagCount.length === 0
      ? setTagCount([tag])
      : tagCount.filter((item) => item !== tag).length === tagCount.length
      ? setTagCount([...tagCount, tag])
      : '';
  };

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
  };

  const handleLinkAdded = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
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
        'https://www.youtube.com/watch?v='
      );
    } else {
      alert('유튜브 링크를 입력해주세요');
      return;
    }

    setFileUrls((prev) => [
      ...prev,
      {
        mediaType: 'url',
        linkUrl: link,
        description: '',
      },
    ]);
    setImgs((prev) => [...prev, link]);
    e.currentTarget.value = '';
  };

  const handleDeleteFile = (index: number) => {
    if (confirm('미디어를 삭제하시겠습니까?')) {
      setImgs((prev) => prev.filter((_, i) => i !== index));
      setFileUrls((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const getVideoCover = (file: File, seekTo = 0.0) => {
    return new Promise((resolve, reject) => {
      // load the file to a video player
      const videoPlayer = document.createElement('video');
      videoPlayer.setAttribute('src', URL.createObjectURL(file));
      videoPlayer.load();
      videoPlayer.addEventListener('error', (ex: ErrorEvent) => {
        reject('error when loading video file' + ex);
      });
      // load metadata of the video to get video duration and dimensions
      videoPlayer.addEventListener('loadedmetadata', () => {
        // seek to user defined timestamp (in seconds) if possible
        if (videoPlayer.duration < seekTo) {
          reject('video is too short.');
          return;
        }
        // delay seeking or else 'seeked' event won't fire on Safari
        setTimeout(() => {
          videoPlayer.currentTime = seekTo;
        }, 200);
        // extract video thumbnail once seeking is complete
        videoPlayer.addEventListener('seeked', () => {
          // define a canvas to have the same dimension as the video
          const canvas = document.createElement('canvas');
          canvas.width = videoPlayer.videoWidth;
          canvas.height = videoPlayer.videoHeight;
          // draw the video frame to canvas
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
          // return the canvas image as a blob
          ctx.canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            'image/jpeg',
            0.75 /* quality */
          );
        });
      });
    });
  };

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
      let count = 0;
      fileUrls.map((fileUrl) => {
        if (fileUrl.mediaType === 'video' || fileUrl.mediaType === 'image') {
          count += 1;
        }
      });
      if (count === 0) {
        setIsUpload(false);
        toast.warn('이미지나 동영상을 업로드해주세요.');
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
        const cover = (await getVideoCover(
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
        return;
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
    <>
      <div
        className='flex animate-fade cursor-pointer flex-row justify-between gap-3 space-y-1 border-x border-b border-white p-3 transition hover:bg-default-100'
        onClick={() => {
          onOpen();
        }}
      >
        <UserInfo />
        <span className='flex h-12 w-[calc(100%-4rem)] items-center truncate rounded-3xl border border-white bg-default-100 px-3 text-left text-sm font-bold text-default-500'>
          {placeholder}
        </span>
      </div>
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
                  <div className='flex flex-row gap-2'>
                    <UserInfo />
                    <PublicTypeCheckBox
                      publicType={publicType}
                      setPublicType={setPublicType}
                    />
                  </div>
                  <input
                    defaultValue={postTitle}
                    placeholder='작품 제목'
                    autoFocus
                    className='mt-1 w-full text-xl font-bold'
                    onChange={(e) => {
                      setPostTitle(e.currentTarget.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.nativeEvent.isComposing) return;
                    }}
                  />
                  <TextareaAutoSize
                    defaultValue={postContent}
                    placeholder={placeholder}
                    minRows={isExpanded ? undefined : 5}
                    maxRows={isExpanded ? undefined : 12}
                    className='min-h-12 mt-0.5 max-h-[90%] w-full resize-none !border-0 px-0 text-lg focus:border-none focus:shadow-none focus:shadow-transparent focus:ring-0'
                    onChange={(e) => {
                      setPostContent(e.currentTarget.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.nativeEvent.isComposing) return;
                    }}
                    onFocus={(e) => {
                      const val = e.target.value;
                      e.target.value = '';
                      e.target.value = val;
                    }}
                  />
                </div>
                <div className='max-w-full gap-1'>
                  <div className='flex  flex-wrap'>
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
                    {tagCount.length < 5 ? (
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
                            if (
                              (e.key === 'Enter' ||
                                e.key == ' ' ||
                                e.code == 'Space') &&
                              !e.nativeEvent.isComposing
                            ) {
                              handleAddTag(
                                e.currentTarget.value.replace(regExp, '')
                              );
                              e.currentTarget.value = '';
                            }
                          }}
                          onChange={(e) => {
                            e.currentTarget.value =
                              e.currentTarget.value.replace(regExp, '');
                          }}
                        />
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className='flex flex-wrap gap-1'>
                    {fileUrls.length > 0 &&
                      fileUrls.map(
                        (file, index) =>
                          fileUrls && (
                            <div
                              key={file.mediaType + index}
                              className='relative h-[76px] w-[76px]'
                            >
                              {file.mediaType === 'image' ? (
                                <ASNextImage
                                  src={imgs[index]}
                                  width={64}
                                  height={64}
                                  alt='image'
                                  className='absolute bottom-0 left-0 h-16 w-16 rounded-md bg-gray-600'
                                />
                              ) : file.mediaType === 'video' ? (
                                <video
                                  className='absolute bottom-0 left-0 h-16 w-16 rounded-md bg-gray-600 object-cover'
                                  src={imgs[index]}
                                />
                              ) : file.mediaType === 'audio' ? (
                                <div className='absolute bottom-0 left-0 h-16 w-16 rounded-md bg-gray-600'>
                                  <p className='text-2xl font-extrabold'>
                                    AUDIO
                                  </p>
                                </div>
                              ) : (
                                <ASNextImage
                                  className='absolute bottom-0 left-0 h-16 w-16 rounded-md bg-gray-600'
                                  src={
                                    imgs[index]
                                      ? 'https://img.youtube.com/vi/' +
                                        imgs[index].substring(
                                          imgs[index].indexOf('=') + 1
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
                                onClick={() => handleDeleteFile(index)}
                              >
                                <AiFillCloseCircle className='h-6 w-6 rounded-full border border-white' />
                              </button>
                            </div>
                          )
                      )}

                    {imgs.length < 10 && (
                      <Popover placement='bottom' offset={20} showArrow>
                        <PopoverTrigger>
                          <div
                            key='plus'
                            className='relative -ml-2 h-[76px] w-[60px]'
                          >
                            <button className='absolute bottom-0 left-0 flex h-16 w-16 cursor-pointer items-center justify-center rounded-md border-2 border-dotted bg-transparent'>
                              <AiOutlinePlus className='h-6 w-6 text-gray-400' />
                            </button>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className='my-2 flex flex-col gap-2'>
                            <label
                              htmlFor='uploads'
                              className='text-md flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary text-center font-bold text-white transition-colors hover:bg-primary-700'
                            >
                              업로드
                            </label>
                            <Input
                              id='urls'
                              type='url'
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleLinkAdded(e);
                                  e.currentTarget.value = '';
                                }
                              }}
                              placeholder='유튜브 링크 https://...'
                              endContent={<Kbd keys='enter'>Enter</Kbd>}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}

                    <input
                      id='uploads'
                      type='file'
                      multiple
                      accept={'image/*,video/*,audio/*'}
                      className='hidden'
                      onChange={handleFileAdded}
                    />
                  </div>
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
    </>
  );
}
