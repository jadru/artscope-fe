'use client';

import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { Bold } from '@tiptap/extension-bold';
import { BulletList } from '@tiptap/extension-bullet-list';
import { Document } from '@tiptap/extension-document';
import { Heading } from '@tiptap/extension-heading';
import { History } from '@tiptap/extension-history';
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
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
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

import { EventTypeData } from '@/app/new/event/EventTypeData';
import jxios from '@/utils/jxios';

import { EventDetailType, EventType } from '@/types/event';

const NewEvent = () => {
  const [link, setLink] = useState<string>('');
  const [eventType, setEventType] = useState<EventType>('STANDARD');
  const [price, setPrice] = useState<string>('무료');
  const { push } = useRouter();
  const [isUpload, setIsUpload] = useState(false);
  const placeholderText = '이벤트를 자유롭게 설명하세요.';
  const params = useParams();

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
      History,
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

  useEffect(() => {
    jxios.get(`/api/events/${params.id}`).then((res) => {
      const data = res.data as EventDetailType;
      editor?.commands.setContent(
        '# ' + data.title + '\n\n' + data.description
      );
      setLink(data.link);
      setEventType(data.eventType);
      setPrice(data.price);
    });
  }, [editor, params.id]);

  const handleCreateSaveButton = useDebounce(async () => {
    if (isUpload) return;
    if (editor?.getHTML() === '<h1></h1><p></p>') {
      toast.error('내용을 입력해주세요.');
      return;
    }
    if (link === '' || price === null) {
      toast.error('항목 전체를 입력해주세요.');
      return;
    }
    setIsUpload(true);
    const markdownContent = editor?.storage.markdown.getMarkdown() || '';
    const data = {
      title:
        editor?.getHTML().substring(4, editor?.getHTML().indexOf('<', 4)) || '',
      description: markdownContent.slice(markdownContent.indexOf('\n') + 2),
      link,
      eventType,
      price,
    };

    await jxios
      .put('/api/events/' + params.id, data)
      .then((res) => {
        if (res.status === 200) {
          toast.success('이벤트가 수정되었습니다.');
          push('/event/' + params.id);
        }
      })
      .catch((err) => {
        toast.error(err.response.data);
      })
      .finally(() => {
        setIsUpload(false);
      });
  }, 500);

  const handleBackButton = () => {
    if (editor?.getHTML() !== '<h1></h1><p></p>') {
      if (confirm('작성 중인 내용이 있습니다. 정말로 나가시겠습니까?')) {
        push('/');
      }
    } else {
      push('/');
    }
  };

  return (
    <>
      <div className='bg-default-50 fixed top-0 z-50 flex h-16 w-full max-w-[718px] items-center justify-between gap-5 border-b px-5'>
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
            }`}>
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
            }`}>
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
            }`}>
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
            }`}>
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
            }`}>
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
            }`}>
            <BiListOl size={25} />
          </button>
        </div>
        <div></div>
      </div>
      <div className='h-16'></div>
      <div className='w-full space-y-2 overflow-y-scroll p-4'>
        {editor && <EditorContent editor={editor} className='min-h-[80px]' />}
      </div>
      <hr className='my-4' />
      <div className='flex flex-col items-start justify-between gap-1 px-3 md:flex-row'>
        <Input
          isRequired
          type='number'
          label='참석자 티켓 가격'
          value={String(price)}
          onValueChange={setPrice}
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
          isRequired>
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
      <div className='h-16'></div>
      <div className='bg-default-50 fixed bottom-0 z-40 flex h-16 w-full max-w-[718px] items-center justify-end border-t px-3'>
        <Button
          onClick={handleCreateSaveButton}
          disabled={isUpload}
          color='primary'
          className={`
            h-12 ${isUpload ? 'opacity-20' : ''}`}>
          이벤트 수정
        </Button>
      </div>
    </>
  );
};

export default NewEvent;
