import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import remarkGfm from 'remark-gfm';

import '@/styles/markdown.scss';
export default function MarkdownVewer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      className='markdown-viewer'
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        [rehypeExternalLinks, { target: '_blank', rel: 'noreferrer' }],
      ]}
    >
      {content}
    </ReactMarkdown>
  );
}
