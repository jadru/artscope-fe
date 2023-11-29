'use client';

import { Button } from '@nextui-org/react';
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

import PublicTypeCheckBox, {
  PublicType,
} from '@/components/New/Artworks/PublicTypeCheckBox';
import NewTagView from '@/components/New/Tag/NewTagView';

import jxios from '@/utils/jxios';

import { ArtworkType } from '@/types/artwork';

const NewArtwork = () => {
  const [tagCount, setTagCount] = useState<string[]>([]);
  const { push } = useRouter();
  const [isUpload, setIsUpload] = useState(false);
  const [publicType, setPublicType] = useState<PublicType>('public');
  const placeholderText =
    '작품을 자유롭게 설명해주세요. \n사진과 동영상은 수정할 수 없어요.';
  const params = useParams();

  const CustomDocument = Document.extend({
    content: 'heading block* paragraph+',
  });

  const editor = useEditor({
    extensions: [
      CustomDocument,
      Heading.configure({
        levels: [1],
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
      History,
      ListItem,
      OrderedList,
      Paragraph,
      Placeholder.configure({
        emptyNodeClass: 'is-artwork-editor-empty',
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return '작품 제목을 입력해주세요.';
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
    jxios.get(`/api/artworks/${params.id}`).then((res) => {
      const data = res.data as ArtworkType;
      editor?.commands.setContent(
        '# ' + data.artwork.title + '\n\n' + data.artwork.description
      );
    });
  }, [editor, params.id]);

  const handleCreateSaveButton = useDebounce(async () => {
    if (isUpload) return;
    if (editor?.getHTML() === '<h1></h1><p></p>') {
      toast.error('내용을 입력해주세요.');
      return;
    }
    setIsUpload(true);
    const markdownContent = editor?.storage.markdown.getMarkdown() || '';
    const data = {
      title:
        editor?.getHTML().substring(4, editor?.getHTML().indexOf('<', 4)) || '',
      description: markdownContent.slice(markdownContent.indexOf('\n') + 2),
      tags: tagCount,
      visible: publicType === 'public',
    };

    jxios
      .put(`/api/artworks/${params.id}`, data)
      .then((res) => {
        if (res.status === 200) {
          toast.success('작품이 수정되었습니다.');
          push('/artwork/' + params.id);
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
      <div className='w-full space-y-6 overflow-y-scroll p-4'>
        {editor && <EditorContent editor={editor} className='min-h-[80px]' />}
        <NewTagView tagCount={tagCount} setTagCount={setTagCount} />
      </div>
      <div className='h-16'></div>
      <div className='bg-default-50 fixed bottom-0 z-50 flex h-16 w-full max-w-[718px] items-center justify-between border-t px-3'>
        <PublicTypeCheckBox
          publicType={publicType}
          setPublicType={setPublicType}
        />
        <Button
          onClick={handleCreateSaveButton}
          disabled={isUpload}
          color='primary'
          className={`
            h-12 ${isUpload ? 'opacity-20' : ''}`}
        >
          작품 수정
        </Button>
      </div>
    </>
  );
};

export default NewArtwork;
