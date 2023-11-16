import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import remarkGfm from 'remark-gfm';

import '@/styles/markdown.scss';
export default function MarkdownVewer({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <ReactMarkdown
      className={'markdown-viewer break-all ' + className}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        [rehypeExternalLinks, { target: '_blank', rel: 'noreferrer' }],
      ]}
    >
      {content}
    </ReactMarkdown>
  );
}
