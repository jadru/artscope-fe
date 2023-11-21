import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import strip from 'strip-markdown';

import '@/styles/markdown.scss';

import { standardLabel } from '@/components/StandardLabel';
export default function MarkdownViewer({
  children,
  className,
  ignoreMarkdown = false,
  ignoreHTML = false,
}: {
  children: string;
  className?: string;
  ignoreMarkdown?: boolean;
  ignoreHTML?: boolean;
}) {
  return (
    <ReactMarkdown
      className={'markdown-viewer break-all ' + className}
      remarkPlugins={ignoreMarkdown ? [remarkGfm, strip] : [remarkGfm]}
      rehypePlugins={
        ignoreHTML
          ? [[rehypeExternalLinks, { target: '_blank', rel: 'noreferrer' }]]
          : [
              [rehypeExternalLinks, { target: '_blank', rel: 'noreferrer' }],
              rehypeRaw,
            ]
      }
    >
      {standardLabel(children)}
    </ReactMarkdown>
  );
}
