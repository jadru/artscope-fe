'use client';

import { Bold } from '@tiptap/extension-bold';
import { BulletList } from '@tiptap/extension-bullet-list';
import { Document } from '@tiptap/extension-document';
import Dropcursor from '@tiptap/extension-dropcursor';
import Heading from '@tiptap/extension-heading';
import { History } from '@tiptap/extension-history';
import Image from '@tiptap/extension-image';
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
import { forEach } from 'lodash';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  BiArrowBack,
  BiBold,
  BiImage,
  BiItalic,
  BiListOl,
  BiListUl,
  BiStrikethrough,
  BiUnderline,
} from 'react-icons/bi';
import { toast } from 'react-toastify';
import { Markdown } from 'tiptap-markdown';

import '@/styles/editor.scss';

import { Button } from '@/components/ui/button';

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

const EditPost = () => {
  const { push } = useRouter();
  const [insertImage, setInsertImage] = useState<string[]>([]);
  const [isUpload, setIsUpload] = useState(false);
  const [title, setTitle] = useState('');
  const placeholder = '예술을 공유하세요.';
  const params = useParams();

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Bold,
      Italic,
      Strike,
      History,
      Underline,
      Image.configure({
        inline: true,
      }),
      Dropcursor,
      Markdown.configure({
        html: true,
        tightLists: true,
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
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content: '<p></p>',
    autofocus: true,
  });

  const handleSubmitPostButton = useDebounce(async () => {
    try {
      setIsUpload(true);

      const content = editor?.storage.markdown.getMarkdown() || '';
      if (content === '') {
        toast.error('내용을 입력해주세요.');
        setIsUpload(false);
        return;
      }
      if (title === '') {
        toast.error('제목을 입력해주세요.');
        setIsUpload(false);
        return;
      }
      const data = await jxios
        .post('/api/magazines', {
          title,
          content,
          categoryId: 1,
          mediaUrls: [NEXT_PUBLIC_MEDIA_STORAGE_URL + '/' + insertImage[0]],
        })
        .then((res) => res.data);
      if (data) {
        toast.success('아티클이 작성 되었습니다.');
        push('/article/' + data.id);
      }
    } catch (err) {
      toast.error((err as string) || '아티클 업로드에 실패했습니다.');
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

  const handleFileUpload = async (files: FileList | null) => {
    if (files) {
      forEach(files, async (file) => {
        if (file.size > 20971520) {
          toast.error('20MB 이하의 파일만 업로드 가능합니다.');
          return;
        }
        await fileUpload(file);
      });
    }
  };

  const fileUpload = async (file: File) => {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: JSON.stringify({
        contentType: file.type,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      const formData = new FormData();
      Object.entries(data.fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', file);
      const responseUpload = await fetch(data.url, {
        method: 'POST',
        body: formData,
      });
      if (responseUpload.ok) {
        editor
          ?.chain()
          .focus()
          .setImage({
            src: NEXT_PUBLIC_MEDIA_STORAGE_URL + '/' + data.fields.key,
          })
          .run();
        setInsertImage((prev) => [...prev, data.fields.key]);
      }
    }
  };

  return (
    <>
      <div className='bg-default-50 fixed top-0 z-50 flex h-16 w-full bg-white/60 backdrop-blur max-w-[766px] items-center justify-between gap-5 border-b px-5'>
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
              editor?.isActive('bold') ? 'text-black' : 'text-gray-400'
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
              editor?.isActive('italic') ? 'text-black' : 'text-gray-400'
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
              editor?.isActive('strike') ? 'text-black' : 'text-gray-400'
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
              editor?.isActive('underline') ? 'text-black' : 'text-gray-400'
            }`}>
            <BiUnderline size={25} />
          </button>
          <hr className='h-6 border-l border-gray-400' />
          <button
            onClick={() => {
              if (editor) {
                editor.chain().focus().setHeading({ level: 1 }).run();
              }
            }}
            className={`hover:text-primary font-bold ${
              editor && editor.isActive('heading', { level: 3 })
                ? 'text-black'
                : 'text-gray-400'
            }`}>
            H1
          </button>
          <button
            onClick={() => {
              if (editor) {
                editor.chain().focus().setHeading({ level: 2 }).run();
              }
            }}
            className={`hover:text-primary font-bold ${
              editor && editor.isActive('heading', { level: 3 })
                ? 'text-black'
                : 'text-gray-400'
            }`}>
            H2
          </button>
          <button
            onClick={() => {
              if (editor) {
                editor.chain().focus().setHeading({ level: 3 }).run();
              }
            }}
            className={`hover:text-primary font-bold ${
              editor && editor.isActive('heading', { level: 3 })
                ? 'text-black'
                : 'text-gray-400'
            }`}>
            H3
          </button>
          <hr className='h-6 border-l border-gray-400' />
          <button
            onClick={() => {
              if (editor) {
                editor.chain().focus().toggleBulletList().run();
              }
            }}
            className={`hover:text-primary ${
              editor?.isActive('bulletList') ? 'text-black' : 'text-gray-400'
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
              editor?.isActive('orderedList') ? 'text-black' : 'text-gray-400'
            }`}>
            <BiListOl size={25} />
          </button>
          <hr className='h-6 border-l border-gray-400' />
          <label htmlFor='image-upload'>
            <BiImage
              size={25}
              className={`hover:text-primary cursor-pointer ${
                insertImage.length > 0 ? 'text-black' : 'text-gray-400'
              }`}
            />
          </label>
          <input
            id='image-upload'
            type='file'
            accept='image/*'
            multiple
            className='hidden'
            onChange={(e) => {
              handleFileUpload(e.target.files);
            }}
          />
        </div>
        <div></div>
      </div>
      <div className='h-16'></div>
      <input
        id='title'
        className='w-full h-16 px-3 text-3xl focus:outline-none -mb-2'
        placeholder='제목을 입력하세요.'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            editor?.chain().focus().run();
          }
        }}
      />
      <div
        className='w-full overflow-y-scroll p-3 min-h-[calc(100vh-64px-64px-64px)] cursor-text !focus:outline-none'
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            editor?.chain().focus().run();
          }
        }}>
        {editor && <EditorContent editor={editor} className='min-h-[80px]' />}
      </div>
      <div className='h-16'></div>
      <div className='bg-default-50 fixed bottom-0 z-50 flex h-16 w-full bg-white/60 backdrop-blur max-w-[766px] items-center justify-end border-t px-3'>
        <Button
          onClick={handleSubmitPostButton}
          disabled={isUpload}
          color='primary'
          className={`
            h-12 ${isUpload ? 'opacity-20' : ''}`}>
          새 아티클 작성
        </Button>
      </div>
    </>
  );
};

export default EditPost;
