import { Color } from '@tiptap/extension-color';
import Document from '@tiptap/extension-document';
import ListItem from '@tiptap/extension-list-item';
import { TextStyle } from '@tiptap/extension-text-style';
import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import jxios from '../../utils/jxios';

const Editor = ({ data, setEditMode }) => {
  const CustomDocument = Document.extend({
    content: 'heading block*',
  });
  const tagInput = useRef();
  const router = useRouter();

  const editor = useEditor({
    content: `<h1>${data.title}</h1>${data.description}`,
    extensions: [
      CustomDocument,
      StarterKit.configure({
        document: false,
      }),
      TextStyle,
      Color,
      ListItem,
    ],
    editorProps: {
      attributes: {
        class: 'editor__content',
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.focus();
    }
  }, [editor]);

  const handleEditSaveButton = () => {
    jxios
      .put('/api/artworks/' + data.id, {
        title: editor.getJSON().content[0].content[0].text,
        description: editor
          .getHTML()
          .substring(editor.getHTML().search('</h1>') + 5),
        visible: true,
        tags: tagInput.current.value.split(',').map((tag) => tag.trim()),
      })
      .then((res) => {
        if (res.status !== 200) {
          toast.error('수정에 실패했습니다.');
          return;
        }
        setEditMode(false);
        router.replace('/artwork/' + data.id);
        toast.success('수정되었습니다.');
      });
  };

  return (
    <div className='editor h-full w-full p-12'>
      {editor && (
        <BubbleMenu
          className='bubble-menu'
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'is-active' : ''}
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'is-active' : ''}
          >
            Italic
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'is-active' : ''}
          >
            Strike
          </button>
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu
          className='floating-menu'
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
            }
          >
            H1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
            }
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
          >
            Bullet List
          </button>
        </FloatingMenu>
      )}

      <div className='form-control w-full max-w-xs'>
        <label className='label'>
          <span className='label-text'>태그 입력</span>
        </label>
        <input
          type='text'
          className='input-bordered input mb-6'
          placeholder='태그'
          defaultValue={data.tags}
          ref={tagInput}
        />
      </div>

      <EditorContent
        editor={editor}
        className='h-full w-full focus:outline-none active:outline-none'
      />

      <button onClick={handleEditSaveButton} className='btn-primary btn mt-8'>
        저장하기
      </button>
    </div>
  );
};

export default Editor;
