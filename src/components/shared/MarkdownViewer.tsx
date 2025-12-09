import { decode } from "html-entities";
import lodash from "lodash";
import ReactMarkdown from "react-markdown";
import rehypeExternalLinks from "rehype-external-links";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkImages from "remark-images";
import strip from "strip-markdown";

import "@/styles/markdown.css";

import ASNextImage from "@/components/shared/ASNextImage";

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
    <article
      className={`
        prose prose-lg max-w-none
        prose-headings:font-semibold prose-headings:tracking-tight
        prose-h1:text-4xl prose-h1:text-gray-900 dark:prose-h1:text-white
        prose-h2:text-3xl prose-h2:text-gray-900 dark:prose-h2:text-white
        prose-h3:text-2xl prose-h3:text-gray-900 dark:prose-h3:text-white
        prose-p:text-lg prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-200
        prose-strong:text-gray-900 prose-strong:font-semibold dark:prose-strong:text-white
        prose-em:text-gray-700 dark:prose-em:text-gray-300
        prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600
        prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
        prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 
        prose-code:text-gray-900 dark:prose-code:text-gray-100
        prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono
        prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 
        prose-pre:text-gray-100 dark:prose-pre:text-gray-200
        prose-pre:rounded-xl prose-pre:shadow-lg
        prose-a:text-blue-600 prose-a:no-underline prose-a:font-medium
        hover:prose-a:text-blue-700 hover:prose-a:underline
        dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300
        prose-img:rounded-2xl prose-img:shadow-xl
        prose-hr:border-gray-200 dark:prose-hr:border-gray-700 prose-hr:my-12
        prose-ul:text-gray-700 dark:prose-ul:text-gray-200
        prose-ol:text-gray-700 dark:prose-ol:text-gray-200
        prose-li:text-gray-700 dark:prose-li:text-gray-200 prose-li:my-2
        prose-table:text-gray-700 dark:prose-table:text-gray-200
        prose-th:bg-gray-100 dark:prose-th:bg-gray-800 
        prose-th:text-gray-900 dark:prose-th:text-white prose-th:font-semibold
        prose-td:border-gray-200 dark:prose-td:border-gray-700
        ${className}
      `}
    >
      <ReactMarkdown
        components={{
          img: ({ src, ...props }) =>
            !ignoreImages ? (
              <figure className="my-16 -mx-4 sm:mx-0">
                <ASNextImage
                  className="mx-auto rounded-2xl shadow-2xl ring-1 ring-gray-900/5 dark:ring-white/10"
                  // @ts-expect-error width/height for ASNextImage
                  width={1200}
                  // @ts-expect-error width/height for ASNextImage
                  height={800}
                  src={src as string}
                  {...props}
                  alt=""
                />
                {props.alt && (
                  <figcaption className="mt-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {props.alt}
                  </figcaption>
                )}
              </figure>
            ) : (
              ""
            ),
          p: ({ ...props }) =>
            !ignoreSize ? (
              <p
                className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-200"
                {...props}
              />
            ) : (
              <p className="font-normal leading-relaxed" {...props} />
            ),
          h1: ({ ...props }) =>
            !ignoreSize ? (
              <h1
                className="mb-8 mt-16 text-center text-5xl font-bold tracking-tight text-gray-900 dark:text-white"
                {...props}
              />
            ) : (
              <p className="font-normal" {...props} />
            ),
          h2: ({ ...props }) =>
            !ignoreSize ? (
              <h2
                className="mb-6 mt-16 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white"
                {...props}
              />
            ) : (
              <p className="font-normal" {...props} />
            ),
          h3: ({ ...props }) =>
            !ignoreSize ? (
              <h3
                className="mb-4 mt-12 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white"
                {...props}
              />
            ) : (
              <p className="font-normal" {...props} />
            ),
          h4: ({ ...props }) =>
            !ignoreSize ? (
              <h4
                className="mb-4 mt-8 text-xl font-semibold text-gray-900 dark:text-white"
                {...props}
              />
            ) : (
              <p className="font-normal" {...props} />
            ),
          ul: ({ ...props }) => (
            <ul
              className="my-8 ml-6 space-y-3 list-disc marker:text-gray-400 dark:marker:text-gray-500 [&>li]:pl-2 [&>li]:leading-relaxed [&>li]:text-gray-700 dark:[&>li]:text-gray-200"
              {...props}
            />
          ),
          ol: ({ ...props }) => (
            <ol
              className="my-8 ml-6 space-y-3 list-decimal marker:text-gray-400 dark:marker:text-gray-500 marker:font-semibold [&>li]:pl-2 [&>li]:leading-relaxed [&>li]:text-gray-700 dark:[&>li]:text-gray-200"
              {...props}
            />
          ),
          li: ({ ...props }) => (
            <li
              className="text-gray-700 dark:text-gray-200 leading-relaxed"
              {...props}
            />
          ),
          blockquote: ({ ...props }) => (
            <blockquote
              className="my-12 border-l-4 border-gray-300 bg-gray-50 py-4 pl-8 pr-6 italic text-gray-700 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-300"
              {...props}
            />
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className?.includes("language-");
            return isInline ? (
              <code
                className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className={`block rounded-xl bg-gray-900 p-4 text-sm font-mono text-gray-100 dark:bg-gray-950 dark:text-gray-200 ${className || ""}`}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ ...props }) => (
            <pre
              className="my-8 overflow-x-auto rounded-xl bg-gray-900 p-6 shadow-2xl dark:bg-gray-950"
              {...props}
            />
          ),
          a: ({ ...props }) => (
            <a
              className="font-medium text-blue-600 underline decoration-blue-600/30 underline-offset-2 transition-colors hover:text-blue-700 hover:decoration-blue-700 dark:text-blue-400 dark:decoration-blue-400/30 dark:hover:text-blue-300 dark:hover:decoration-blue-300"
              {...props}
            />
          ),
          strong: ({ ...props }) => (
            <strong
              className="font-semibold text-gray-900 dark:text-white"
              {...props}
            />
          ),
          em: ({ ...props }) => (
            <em
              className="italic text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          hr: ({ ...props }) => (
            <hr
              className="my-12 border-t border-gray-200 dark:border-gray-700"
              {...props}
            />
          ),
          table: ({ ...props }) => (
            <div className="my-8 overflow-x-auto">
              <table
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                {...props}
              />
            </div>
          ),
          thead: ({ ...props }) => (
            <thead className="bg-gray-100 dark:bg-gray-800" {...props} />
          ),
          tbody: ({ ...props }) => (
            <tbody
              className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/50"
              {...props}
            />
          ),
          tr: ({ ...props }) => <tr {...props} />,
          th: ({ ...props }) => (
            <th
              className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white"
              {...props}
            />
          ),
          td: ({ ...props }) => (
            <td
              className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200"
              {...props}
            />
          ),
        }}
        remarkPlugins={[
          ignoreMarkdown
            ? [remarkGfm, strip, remarkImages]
            : [remarkGfm, remarkImages],
        ]}
        rehypePlugins={
          ignoreHTML
            ? [[rehypeExternalLinks, { target: "_blank", rel: "noreferrer" }]]
            : [
                [rehypeExternalLinks, { target: "_blank", rel: "noreferrer" }],
                rehypeRaw,
              ]
        }
      >
        {lodash.unescape(decode(children))}
      </ReactMarkdown>
    </article>
  );
}
