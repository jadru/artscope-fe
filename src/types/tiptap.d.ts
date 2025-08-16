import { Editor } from "@tiptap/react";

declare module "@tiptap/react" {
  interface Editor {
    storage: Editor["storage"] & {
      markdown?: {
        getMarkdown(): string;
        setMarkdown(markdown: string): void;
      };
    };
  }
}
