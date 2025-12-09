"use client";

import { decode } from "html-entities";
import lodash from "lodash";
import ReactMarkdown from "react-markdown";
import rehypeExternalLinks from "rehype-external-links";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <article className="prose prose-gray max-w-none">
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="mb-4 text-base leading-relaxed text-gray-700">
              {children}
            </p>
          ),
          h1: ({ children }) => (
            <h1 className="mb-6 mt-8 text-2xl font-bold text-gray-900">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-4 mt-6 text-xl font-semibold text-gray-900">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-3 mt-4 text-lg font-medium text-gray-900">
              {children}
            </h3>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-600">{children}</em>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-gray-900 underline underline-offset-2 hover:text-gray-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="my-4 ml-4 list-disc space-y-2 text-gray-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 ml-4 list-decimal space-y-2 text-gray-700">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-base leading-relaxed">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-gray-300 pl-4 italic text-gray-600">
              {children}
            </blockquote>
          ),
          img: () => null, // Images handled separately
        }}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          [rehypeExternalLinks, { target: "_blank", rel: "noreferrer" }],
          rehypeRaw,
        ]}
      >
        {lodash.unescape(decode(content))}
      </ReactMarkdown>
    </article>
  );
}
