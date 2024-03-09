import { decode } from 'html-entities';
import lodash from 'lodash';
import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkImages from 'remark-images';
import remarkUnwrapImages from 'remark-unwrap-images';
import strip from 'strip-markdown';

import '@/styles/markdown.scss';

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
      className={'markdown-viewer break-all space-y-2 ' + className}
      components={{
        img: ({ node, ...props }) => (
          <img className='w-full' {...props} alt='' />
        ),
        p: ({ node, ...props }) => <p className='pt-1.5' {...props} />,
      }}
      remarkPlugins={[
        ignoreMarkdown
          ? [remarkGfm, strip, remarkImages, remarkUnwrapImages]
          : [remarkGfm, remarkImages, remarkUnwrapImages],
      ]}
      rehypePlugins={
        ignoreHTML
          ? [[rehypeExternalLinks, { target: '_blank', rel: 'noreferrer' }]]
          : [
              [rehypeExternalLinks, { target: '_blank', rel: 'noreferrer' }],
              rehypeRaw,
            ]
      }>
      {lodash.unescape(decode(children))}
    </ReactMarkdown>
  );
}
