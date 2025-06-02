import { decode } from 'html-entities';
import lodash from 'lodash';
import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkImages from 'remark-images';
import remarkUnwrapImages from 'remark-unwrap-images';
import strip from 'strip-markdown';

import '@/styles/markdown.css';

import ASNextImage from '@/components/ASNextImage';

export default function MarkdownViewer({
  children,
  className,
  ignoreMarkdown = false,
  ignoreHTML = false,
  ignoreImages = false,
  ignoreSize = false,
}: {
  children: string;
  className?: string;
  ignoreMarkdown?: boolean;
  ignoreHTML?: boolean;
  ignoreImages?: boolean;
  ignoreSize?: boolean;
}) {
  return (
    <ReactMarkdown
      className={'markdown-viewer break-all space-y-2 ' + className}
      components={{
        img: ({ node, src, ...props }) =>
          !ignoreImages ? (
            <ASNextImage
              className='w-full mb-1'
              // @ts-ignore
              width={600}
              // @ts-ignore
              height={600}
              src={src as string}
              {...props}
              alt=''
            />
          ) : (
            ''
          ),
        // eslint-disable-next-line unused-imports/no-unused-vars
        p: ({ node, ...props }) =>
          !ignoreSize ? (
            <p className='pt-1.5 font-normal' {...props} />
          ) : (
            <p className='font-normal' {...props} />
          ),
        // eslint-disable-next-line unused-imports/no-unused-vars
        h1: ({ node, ...props }) =>
          !ignoreSize ? (
            <h2 className='text-3xl font-bold pt-2' {...props} />
          ) : (
            <p className='font-normal' {...props} />
          ),
        // eslint-disable-next-line unused-imports/no-unused-vars
        h2: ({ node, ...props }) =>
          !ignoreSize ? (
            <h3 className='text-2xl font-bold pt-2' {...props} />
          ) : (
            <p className='font-normal' {...props} />
          ),
        // eslint-disable-next-line unused-imports/no-unused-vars
        h3: ({ node, ...props }) =>
          !ignoreSize ? (
            <h4 className='text-xl font-bold pt-2' {...props} />
          ) : (
            <p className='font-normal' {...props} />
          ),
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
