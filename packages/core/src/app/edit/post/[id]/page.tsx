'use client';

import { Button } from '@nextui-org/react';
import { Bold } from '@tiptap/extension-bold';
import { BulletList } from '@tiptap/extension-bullet-list';
import { Document } from '@tiptap/extension-document';
import { Italic } from '@tiptap/extension-italic';
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

import jxios from '@/utils/jxios';

import { SinglePostType } from '@/types/feed';

const EditPost = () => {
  const { push } = useRouter();
  const [isUpload, setIsUpload] = useState(false);
  const placeholder =
    '예술을 공유해보세요. \n사진과 동영상은 수정할 수 없어요.';
  const params = useParams();

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Bold,
      Italic,
      Strike,
      Underline,
      Markdown.configure({
        html: false,
        tightLists: true,
        linkify: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      BulletList,
      ListItem,
      OrderedList,
      Paragraph,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: '',
    autofocus: true,
  });

  useEffect(() => {
    jxios.get(`/api/posts/${params.id}`).then((res) => {
      const data = res.data as SinglePostType;
      editor?.commands.setContent(data.content);
    });
  }, [editor, params.id]);

  const handleSubmitPostButton = useDebounce(async () => {
    try {
      setIsUpload(true);

      const content = editor?.storage.markdown.getMarkdown() || '';
      if (content === '') {
        toast.error('내용을 입력해주세요.');
        setIsUpload(false);
        return;
      }
      await jxios.put(`/api/posts/${params.id}`, { content });
      toast.success('포스트가 수정 되었습니다.');
      push('/post/' + params.id);
    } catch (err) {
      toast.error((err as string) || '포스트 수정에 실패했습니다.');
    } finally {
      setIsUpload(false);
    }
  }, 500);

  const handleBackButton = () => {
    if (editor?.storage.markdown.getMarkdown() !== '') {
      if (confirm('수정 중인 내용이 있습니다. 정말로 나가시겠습니까?')) {
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
      <div className='w-full overflow-y-scroll p-4'>
        {editor && <EditorContent editor={editor} className='min-h-[80px]' />}
      </div>
      <div className='h-16'></div>
      <div className='bg-default-50 fixed bottom-0 z-50 flex h-16 w-full max-w-[718px] items-center justify-end border-t px-3'>
        <Button
          onClick={handleSubmitPostButton}
          disabled={isUpload}
          color='primary'
          className={`
            h-12 ${isUpload ? 'opacity-20' : ''}`}
        >
          포스트 수정
        </Button>
      </div>
    </>
  );
};

export default EditPost;
