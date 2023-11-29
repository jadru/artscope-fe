'use client';

import { Button, Input } from '@nextui-org/react';
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

import AnonymousCheckBox from '@/app/new/agora/AnonymousCheckBox';
import jxios from '@/utils/jxios';

import { AgoraDetailType } from '@/types/agora';

const NewArtwork = () => {
  const { push } = useRouter();
  const [anonymousType, setAnonymousType] = useState<boolean>(true);
  const [isUpload, setIsUpload] = useState(false);
  const [buttonText, setButtonText] = useState<{
    agreeText: string;
    naturalText: string;
    disagreeText: string;
  }>({
    agreeText: '',
    naturalText: '',
    disagreeText: '',
  });
  const placeholderText = '주제에 대한 아고라 제안 이유를 설명해주세요.';
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
      History,
      BulletList,
      ListItem,
      OrderedList,
      Paragraph,
      Placeholder.configure({
        emptyNodeClass: 'is-artwork-editor-empty',
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return '토론한 주제를 입력해주세요.';
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
    jxios.get(`/api/agoras/${params.id}`).then((res) => {
      const data = res.data as AgoraDetailType;
      editor?.commands.setContent(
        '# ' + data.agora.title + '\n\n' + data.agora.content
      );
      setButtonText({
        agreeText: data.agora.agreeText,
        naturalText: data.agora.naturalText,
        disagreeText: data.agora.disagreeText,
      });
      setAnonymousType(data.agora.isAnonymous);
    });
  }, [editor, params.id]);

  const handleCreateSaveButton = useDebounce(async () => {
    if (isUpload) return;
    if (editor?.getHTML() === '<h1></h1><p></p>') {
      toast.error('내용을 입력해주세요.');
      return;
    }
    if (
      buttonText.agreeText === '' ||
      buttonText.disagreeText === '' ||
      buttonText.naturalText === ''
    ) {
      toast.error('버튼 텍스트를 입력해주세요.');
      return;
    }
    setIsUpload(true);
    const markdownContent = editor?.storage.markdown.getMarkdown() || '';
    const data = {
      title:
        editor?.getHTML().substring(4, editor?.getHTML().indexOf('<', 4)) || '',
      content: markdownContent.slice(markdownContent.indexOf('\n') + 2),
      agreeText: buttonText.agreeText,
      disagreeText: buttonText.disagreeText,
      naturalText: buttonText.naturalText,
      isAnonymous: anonymousType,
    };
    jxios
      .put('/api/agoras/' + params.id, data)
      .then((res) => {
        if (res.status === 200) {
          toast.success('아고라가 수정되었습니다.');
          push('/agora/' + params.id);
        }
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
      <div className='w-full space-y-2 overflow-y-scroll p-4'>
        {editor && <EditorContent editor={editor} className='min-h-[80px]' />}
      </div>
      <div className='flex w-full flex-col gap-2 p-3 md:flex-row'>
        <Input
          label='반대 의견 텍스트'
          placeholder='반대'
          isRequired
          value={buttonText.disagreeText}
          onValueChange={(value) =>
            setButtonText((prev) => {
              return {
                ...prev,
                disagreeText: value,
              };
            })
          }
        />
        <Input
          label='중립 의견 텍스트'
          placeholder='고민해봐야'
          isRequired
          value={buttonText.naturalText}
          onValueChange={(value) =>
            setButtonText((prev) => {
              return {
                ...prev,
                naturalText: value,
              };
            })
          }
        />
        <Input
          label='찬성 의견 텍스트'
          placeholder='동의'
          isRequired
          value={buttonText.agreeText}
          onValueChange={(value) =>
            setButtonText((prev) => {
              return {
                ...prev,
                agreeText: value,
              };
            })
          }
        />
      </div>
      <div className='h-16'></div>
      <div className='bg-default-50 fixed bottom-0 z-50 flex h-16 w-full max-w-[718px] items-center justify-between border-t px-3'>
        <AnonymousCheckBox
          anonymousType={anonymousType}
          setAnonymousType={setAnonymousType}
        />
        <Button
          onClick={handleCreateSaveButton}
          disabled={isUpload}
          color='primary'
          className={`
            h-12 ${isUpload ? 'opacity-20' : ''}`}
        >
          아고라 수정
        </Button>
      </div>
    </>
  );
};

export default NewArtwork;
