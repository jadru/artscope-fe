'use client';

import {
  DateTimePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { Bold } from '@tiptap/extension-bold';
import { BulletList } from '@tiptap/extension-bullet-list';
import { Document } from '@tiptap/extension-document';
import { Heading } from '@tiptap/extension-heading';
import { Italic } from '@tiptap/extension-italic';
import { Link } from '@tiptap/extension-link';
import { ListItem } from '@tiptap/extension-list-item';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Strike } from '@tiptap/extension-strike';
import { Text } from '@tiptap/extension-text';
import { Underline } from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import { useDebounce } from '@toss/react';
import { add, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  BiArrowBack,
  BiBold,
  BiItalic,
  BiListOl,
  BiListUl,
  BiStrikethrough,
  BiUnderline,
} from 'react-icons/bi';
import { toast } from 'react-toastify';
import { Markdown } from 'tiptap-markdown';

import '@/styles/editor.scss';

import getVideoCoverFromLocal from '@/components/New/Artworks/getVideoCoverFromLocal';
import NewMediaView from '@/components/New/Media/NewMediaView';

import { EventTypeData } from '@/app/new/event/EventTypeData';
import {
  initialEventSchema,
  initialScheduleSchema,
} from '@/app/new/event/initialEventSchema';
import AddLocation from '@/app/new/event/location/AddLocation';
import jxios from '@/utils/jxios';

import { ArtWorkMediaType } from '@/types/artwork';
import {
  CreateScheduleTempType,
  CreateScheduleType,
  EventDetailType,
  EventType,
} from '@/types/event';

const NewEvent = () => {
  const [fileUrls, setFileUrls] = useState<ArtWorkMediaType[]>([]);
  const [link, setLink] = useState<string>('');
  const [eventType, setEventType] = useState<EventType>('STANDARD');
  const [price, setPrice] = useState<number>(0);
  const [imgs, setImgs] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<CreateScheduleTempType[]>([
    initialScheduleSchema,
  ]);

  const { push } = useRouter();
  const [isUpload, setIsUpload] = useState(false);
  const placeholderText = '이벤트를 자유롭게 설명해주세요.';

  const CustomDocument = Document.extend({
    content: 'heading block* paragraph+',
  });

  const editor = useEditor({
    extensions: [
      CustomDocument,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        protocols: ['http', 'https'],
      }),
      Text,
      Bold,
      Italic,
      Markdown.configure({
        html: false,
        tightLists: true,
        linkify: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      Strike,
      Underline,
      BulletList,
      ListItem,
      OrderedList,
      Paragraph,
      Placeholder.configure({
        emptyNodeClass: 'is-artwork-editor-empty',
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return '이벤트 제목을 입력해주세요.';
          }
          return placeholderText;
        },
        showOnlyCurrent: false,
      }),
    ],
    content: '',
    autofocus: true,
  });

  const handleCreateSaveButton = useDebounce(async () => {
    if (isUpload) return;
    try {
      if (fileUrls.length === 0) {
        toast.warn('이미지, 영상 또는 썸네일을 업로드해주세요.');
        return;
      }
      if (
        editor?.getHTML().substring(4, editor?.getHTML().indexOf('<', 4))
          .length === 0
      ) {
        toast.warn('제목을 입력해주세요.');
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
        toast.warn('파일 용량이 너무 큽니다.');
        return;
      }
      if (!schedule[0].locationId) return toast.warn('장소를 선택해주세요.');
      setIsUpload(true);
      const newState = { ...initialEventSchema };
      const markdownContent = editor?.storage.markdown.getMarkdown() || '';
      newState.dto.title =
        editor?.getHTML().substring(4, editor?.getHTML().indexOf('<', 4)) || '';
      newState.dto.description = markdownContent.slice(
        markdownContent.indexOf('\n') + 2
      );
      newState.dto.link = link;
      newState.dto.eventType = eventType;
      newState.dto.price = price;
      newState.dto.schedule = schedule.reduce((acc, cur) => {
        acc.push({
          locationId: Number(cur.locationId),
          startDateTime: format(cur.startDateTime, "yyyy-MM-dd'T'HH:mm"),
          endDateTime: format(cur.endDateTime, "yyyy-MM-dd'T'HH:mm"),
          participants: cur.participants,
          detailLocation: cur.detailLocation,
        });
        return acc;
      }, [] as CreateScheduleType[]);
      const formData = new FormData();
      if (fileUrls[0].mediaType === 'video') {
        const cover = (await getVideoCoverFromLocal(
          fileUrls[0].file as File,
          1.5
        )) as Blob;
        formData.append(
          'thumbnailFile',
          new File([cover], 'thumbnail.jpg', { type: 'image/jpeg' })
        );
      } else if (fileUrls[0].mediaType === 'image') {
        formData.append('thumbnailFile', fileUrls[0].file as File);
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
        new Blob([JSON.stringify(newState.dto)], { type: 'application/json' })
      );
      await jxios
        .post('/api/exhibitions', formData, {
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
  }, 500);

  const handleBackButton = () => {
    if (editor?.getHTML() !== '<p></p>' || fileUrls.length > 0) {
      if (confirm('작성 중인 내용이 있습니다. 정말로 나가시겠습니까?')) {
        push('/');
      }
    } else {
      push('/');
    }
  };

  return (
    <>
      <div className='fixed top-0 z-50 flex h-16 w-full max-w-[718px] items-center justify-between gap-5 border-b bg-default-50 px-5'>
        <button onClick={handleBackButton}>
          <BiArrowBack className='h-6 w-6 hover:text-blue-600' />
        </button>
        <div className='flex items-center justify-center gap-5'>
          <button
            onClick={() => {
              if (editor) {
                editor.chain().focus().toggleBold().run();
              }
            }}
            className={`hover:text-primary ${
              editor?.isActive('bold') ? 'text-black' : 'text-default'
            }`}
          >
            <BiBold size={25} />
          </button>
          <button
            onClick={() => {
              if (editor) {
                editor.chain().focus().toggleItalic().run();
              }
            }}
            className={`hover:text-primary ${
              editor?.isActive('italic') ? 'text-black' : 'text-default'
            }`}
          >
            <BiItalic size={25} />
          </button>
          <button
            onClick={() => {
              if (editor) {
                editor.chain().focus().toggleStrike().run();
              }
            }}
            className={`hover:text-primary ${
              editor?.isActive('strike') ? 'text-black' : 'text-default'
            }`}
          >
            <BiStrikethrough size={25} />
          </button>
          <button
            onClick={() => {
              if (editor) {
                editor.chain().focus().toggleUnderline().run();
              }
            }}
            className={`hover:text-primary ${
              editor?.isActive('underline') ? 'text-black' : 'text-default'
            }`}
          >
            <BiUnderline size={25} />
          </button>
          <button
            onClick={() => {
              if (editor) {
                editor.chain().focus().toggleBulletList().run();
              }
            }}
            className={`hover:text-primary ${
              editor?.isActive('bulletList') ? 'text-black' : 'text-default'
            }`}
          >
            <BiListUl size={25} />
          </button>
          <button
            onClick={() => {
              if (editor) {
                editor.chain().focus().toggleOrderedList().run();
              }
            }}
            className={`hover:text-primary ${
              editor?.isActive('orderedList') ? 'text-black' : 'text-default'
            }`}
          >
            <BiListOl size={25} />
          </button>
        </div>
        <div></div>
      </div>
      <div className='h-16'></div>
      <div className='w-full space-y-2 overflow-y-scroll p-4'>
        {editor && <EditorContent editor={editor} className='min-h-[80px]' />}
        <NewMediaView
          fileUrls={fileUrls}
          setFileUrls={setFileUrls}
          setImgs={setImgs}
          imgs={imgs}
          header='미디어 또는 링크 업로드'
          onlyImage
        />
      </div>
      <hr className='my-4' />
      <div className='flex flex-col items-start justify-between gap-1 px-3 md:flex-row'>
        <Input
          isRequired
          type='number'
          label='참석자 티켓 가격'
          value={String(price)}
          onValueChange={(value) => setPrice(Number(value))}
          placeholder='가격을 입력해주세요'
          description='무료인 경우 0을 입력해주세요'
          endContent={
            <div className='pointer-events-none flex items-center'>
              <span className='text-small text-default-400'>원</span>
            </div>
          }
        />
        <Select
          label='이벤트 타입'
          defaultSelectedKeys={[EventTypeData[0].value]}
          value={eventType}
          onChange={(e) => setEventType(e.target.value as EventType)}
          className='w-full'
          isRequired
        >
          {EventTypeData.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
        <Input
          isRequired
          type='url'
          label='링크'
          value={link}
          onValueChange={setLink}
          placeholder='관련 링크를 입력해주세요.'
          className='w-full'
        />
      </div>
      <hr className='my-4' />
      <div className='flex items-center justify-between px-3'>
        <h3 className='text-lg font-bold'>일정</h3>
        <button
          onClick={() => {
            setSchedule((prev) => [
              ...prev,
              prev.length === 0
                ? initialScheduleSchema
                : {
                    ...prev[prev.length - 1],
                    id: prev[prev.length - 1].id + 1,
                    locationId: prev[prev.length - 1].locationId,
                    locationName: prev[prev.length - 1].locationName,
                    startDateTime: add(prev[prev.length - 1].startDateTime, {
                      days: 1,
                    }),
                    endDateTime: add(prev[prev.length - 1].endDateTime, {
                      days: 1,
                    }),
                  },
            ]);
          }}
          className='flex items-center justify-center gap-2 text-sm text-default-500 hover:text-default-900'
        >
          + 일정 추가
        </button>
      </div>
      <div className='flex flex-col items-stretch gap-2 px-3 py-2'>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
          {schedule.map((item, index) => (
            <div
              key={item.id}
              className='flex flex-col gap-3 rounded-xl border p-2'
            >
              <div className='flex justify-between'>
                <div className='flex items-center justify-start gap-1'>
                  <AddLocation
                    setSchedule={setSchedule}
                    scheduleIndex={index}
                    schedule={schedule}
                  />
                  <Input
                    className='h-12'
                    label='상세 이벤트 장소'
                    value={item.detailLocation}
                    placeholder='예) 1층 101호'
                    onValueChange={(value) =>
                      setSchedule((prev) => {
                        const temp = [...prev];
                        temp[index].detailLocation = value;
                        return [...temp];
                      })
                    }
                    variant='bordered'
                  />
                </div>
                <button
                  onClick={() =>
                    setSchedule((prev) =>
                      prev.length === 1
                        ? [initialScheduleSchema]
                        : prev.filter((deleteItem) => deleteItem.id !== item.id)
                    )
                  }
                >
                  삭제
                </button>
              </div>
              <div className='flex flex-col gap-2 md:flex-row'>
                <DateTimePicker
                  label='시작 날짜 및 시간'
                  value={item.startDateTime}
                  onChange={(newValue) =>
                    newValue &&
                    setSchedule((prev) => {
                      const temp = [...prev];
                      temp[index].startDateTime = newValue;
                      temp[index].endDateTime = add(newValue, { hours: 2 });
                      return [...temp];
                    })
                  }
                />
                <TimePicker
                  label='종료 시간'
                  value={item.endDateTime}
                  onChange={(newValue) => {
                    newValue &&
                      setSchedule((prev) => {
                        const temp = [...prev];
                        if (newValue < temp[index].startDateTime)
                          if (confirm('혹시 이벤트가 자정을 넘기나요?'))
                            temp[index].endDateTime = add(newValue, {
                              days: 1,
                            });
                          else
                            temp[index].endDateTime = add(
                              temp[index].startDateTime,
                              {
                                hours: 2,
                              }
                            );
                        return [...temp];
                      });
                  }}
                />
              </div>
              {/* <div> */}
              {/*   <p> */}
              {/*     참여 예술가{' '} */}
              {/*     <b className='text-sm text-default-600'> */}
              {/*       @으로 Artscope 회원을 찾을 수 있습니다 */}
              {/*     </b> */}
              {/*   </p> */}
              {/*   <NewParticipant */}
              {/*     schedule={schedule} */}
              {/*     setSchedule={setSchedule} */}
              {/*     index={index} */}
              {/*   /> */}
              {/* </div> */}
            </div>
          ))}
        </LocalizationProvider>
      </div>
      <div className='h-16'></div>
      <div className='fixed bottom-0 z-40 flex h-16 w-full max-w-[718px] items-center justify-end border-t bg-default-50 px-3'>
        <Button
          onClick={handleCreateSaveButton}
          disabled={isUpload}
          color='primary'
          className={`
            h-12 ${isUpload ? 'opacity-20' : ''}`}
        >
          새 이벤트 등록
        </Button>
      </div>
    </>
  );
};

export default NewEvent;
