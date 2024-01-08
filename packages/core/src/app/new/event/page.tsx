'use client';

import { Input, Select, SelectItem } from '@nextui-org/react';
import { useDebounce } from '@toss/react';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import '@/styles/editor.scss';

import DateMultiplePicker from '@/components/DateMultiplePicker';
import getVideoCoverFromLocal from '@/components/New/Artworks/getVideoCoverFromLocal';
import StandardEditor from '@/components/StandardEditor';

import { EventTypeData } from '@/app/new/event/EventTypeData';
import { initialEventSchema } from '@/app/new/event/initialEventSchema';
import jxios from '@/utils/jxios';

import { ArtWorkMediaType } from '@/types/artwork';
import { EventDetailType, EventType } from '@/types/event';

const NewEvent = () => {
  const [eventSchedule, setEventSchedule] = useState<Date[]>([]);
  const { push } = useRouter();
  const [isUpload, setIsUpload] = useState(false);
  const [eventType, setEventType] = useState<EventType>('EXHIBITION');
  const [operationTime, setOperationTime] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');

  const handleCreateSaveButton = useDebounce(
    async (markdown: string, medias: ArtWorkMediaType[]) => {
      if (isUpload) return;
      try {
        if (medias.length === 0) {
          toast.warn('이미지, 영상 또는 썸네일을 업로드해주세요.');
          return;
        }
        if (markdown.substring(1).length === 0) {
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
          toast.warn('파일 용량이 너무 큽니다.');
          return;
        }
        setIsUpload(true);
        const newState = { ...initialEventSchema };
        const markdownContent = markdown.slice(markdown.indexOf('\n') + 2);
        newState.dto.title = markdown.slice(1, markdown.indexOf('\n')).trim();
        newState.dto.description = markdownContent.slice(
          markdownContent.indexOf('\n') + 2
        );
        newState.dto.link = link;
        newState.dto.eventType = eventType;
        newState.dto.price = price;
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
            : formData.append('mediaFiles', media.file as File);
          if (newState.dto.medias)
            newState.dto.medias.push({
              mediaType: media.mediaType,
            });
        });
        formData.append(
          'dto',
          new Blob([JSON.stringify(newState.dto)], {
            type: 'application/json',
          })
        );
        await jxios
          .post('/api/events', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json',
            },
          })
          .then((res) => {
            const data = res.data as EventDetailType;
            if (res.status === 201) {
              toast.success('이벤트가 업로드되었습니다.');
              push('/event/' + data.id);
            }
          })
          .catch((err) => {
            toast.error(err.response.data);
          });
      } catch (err) {
        toast.error((err as string) || '이벤트 업로드에 실패했습니다.');
      } finally {
        setIsUpload(false);
      }
    },
    500
  );

  return (
    <>
      <StandardEditor
        onSubmit={handleCreateSaveButton}
        isUpload={isUpload}
        submitText='이벤트 작성'
        headingRequired
        documentHeading={3}
        placeholderText='이벤트에 대한 설명을 자유롭게 작성해주세요.'>
        <form>
          <div className='flex flex-col items-start justify-between gap-1 px-3'>
            <h5 className='mt-2'>정보 입력</h5>
            <Select
              items={EventTypeData}
              label='이벤트 타입'
              defaultSelectedKeys={[EventTypeData[0].value]}
              value={eventType}
              onChange={(e) => setEventType(e.target.value as EventType)}
              className='w-full'
              isRequired>
              {(user) => (
                <SelectItem
                  key={user.value}
                  textValue={`${user.label} ${user.value}`}>
                  <div className='flex gap-2 items-center'>
                    <div className='flex flex-col'>
                      <span className='text-small'>
                        {user.label} {user.value}
                      </span>
                      <span className='text-tiny text-default-400'>
                        {user.description}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>
            <div className='bg-default-100 rounded-xl p-3 flex-col w-full justify-between'>
              <div>
                {!eventSchedule[1] && (
                  <p className='mb-4'>날짜를 선택해주세요.</p>
                )}
                {eventSchedule[0] && (
                  <h4>
                    {eventSchedule[1] && '시작 날짜 : '}
                    {format(eventSchedule[0], 'yyyy년 MM월 dd일 (eee)', {
                      locale: ko,
                    })}
                  </h4>
                )}
                {eventSchedule[1] && (
                  <h4>
                    {eventSchedule[1] && '종료 날짜 : '}
                    {format(
                      eventSchedule[eventSchedule.length - 1],
                      'yyyy년 MM월 dd일 (eee)',
                      {
                        locale: ko,
                      }
                    )}
                  </h4>
                )}
              </div>
              <DateMultiplePicker
                scheduleDate={eventSchedule}
                onDateChangeRange={setEventSchedule}
              />
            </div>
            <h5 className='mt-2'>추가 정보 입력</h5>
            <Input
              label='운영시간'
              value={operationTime}
              onValueChange={setOperationTime}
              placeholder='운영시간을 입력해주세요.'
            />
            <Input
              label='참석자 티켓 가격'
              value={price}
              onValueChange={setPrice}
              placeholder='가격을 입력해주세요'
            />
            <Input
              type='url'
              label='링크'
              value={link}
              onValueChange={setLink}
              placeholder='관련 링크를 입력해주세요.'
              className='w-full'
            />
          </div>
        </form>
      </StandardEditor>
    </>
  );
};

export default NewEvent;
