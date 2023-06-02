import ListItem from '@tiptap/extension-list-item';
import { TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';

const ReadOnlyEditor = ({ data }: { data: string }) => {
  const editor = useEditor({
    content: `${data}`,
    extensions: [StarterKit, TextStyle, ListItem],
    editorProps: {
      attributes: {
        class: 'editor__content',
      },
    },
  });

  if (!editor) {
    return null;
  }

  editor.setEditable(false);
  return (
    <EditorContent
      editor={editor}
      readOnly
      className='h-full w-full pb-12 focus:outline-none active:outline-none'
    />
  );
};

export default ReadOnlyEditor;
