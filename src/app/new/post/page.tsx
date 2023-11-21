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
import { useRouter } from 'next/navigation';
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

import NewMediaView from '@/components/New/Media/NewMediaView';

import { initialPostSchema } from '@/app/new/post/initialPostSchema';
import jxios from '@/utils/jxios';

import { ArtWorkMediaType } from '@/types/artwork';

const NewPost = () => {
  const [fileUrls, setFileUrls] = useState<ArtWorkMediaType[]>([]);
  const [imgs, setImgs] = useState<string[]>([]);
  const [insertImage, setInsertImage] = useState<boolean>(false);
  const { push } = useRouter();
  const [isUpload, setIsUpload] = useState(false);
  const placeholder =
    '예술을 공유해보세요. \n사진과 링크로도 공유할 수 있어요.';

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

  const handleSubmitPostButton = useDebounce(async () => {
    if (isUpload) return;
    try {
      const postContent = editor?.storage.markdown.getMarkdown() || '';
      if (postContent.length < 10) {
        toast('10자 이상 입력해주세요.');
        return;
      }
      if (postContent.length > 1000) {
        toast('1000자 이하로 입력해주세요.');
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
      const newState = { ...initialPostSchema };
      newState.dto.content = postContent;

      const formData = new FormData();
      if (fileUrls.length > 0) {
        newState.dto.thumbnail = {
          mediaType: 'image',
        };
        formData.append('thumbnailFile', fileUrls[0].file as File);
        newState.dto.medias = [];
        fileUrls.forEach((media) => {
          formData.append('mediaFiles', media.file as File);
          newState.dto.medias?.push({
            mediaType: media.mediaType,
          });
        });
      }
      formData.append(
        'dto',
        new Blob([JSON.stringify(newState.dto)], { type: 'application/json' })
      );
      await jxios
        .post('/api/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        })
        .then((res) => {
          if (res.status === 201) {
            toast.success('포스트가 업로드되었습니다.');
            push('/');
          }
        })
        .catch((err) => {
          setIsUpload(false);
          toast.error(err.response.data);
        });
    } catch (err) {
      toast.error((err as string) || '포스트 업로드에 실패했습니다.');
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
          <button onClick={() => setInsertImage((prev) => !prev)}>
            <BiImage
              size={25}
              className={`hover:text-primary ${
                insertImage ? 'text-black' : 'text-default'
              }`}
            />
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
        {insertImage && (
          <NewMediaView
            fileUrls={fileUrls}
            setFileUrls={setFileUrls}
            setImgs={setImgs}
            imgs={imgs}
            onlyImage
            header='이미지 첨부'
          />
        )}
      </div>
      <div className='h-16'></div>
      <div className='fixed bottom-0 z-50 flex h-16 w-full max-w-[718px] items-center justify-end border-t bg-default-50 px-3'>
        <Button
          onClick={handleSubmitPostButton}
          disabled={isUpload}
          color='primary'
          className={`
            h-12 ${isUpload ? 'opacity-20' : ''}`}
        >
          새 포스트 작성
        </Button>
      </div>
    </>
  );
};

export default NewPost;
