import { decode } from "html-entities";
import lodash from "lodash";
import ReactMarkdown from "react-markdown";
import rehypeExternalLinks from "rehype-external-links";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkImages from "remark-images";
import strip from "strip-markdown";

import "@/styles/markdown.css";

import ASNextImage from "@/components/ASNextImage";

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
    <div
      className={
        "prose prose-lg max-w-none prose-headings:font-medium prose-headings:text-gray-900 prose-p:text-base prose-p:leading-[1.75] prose-img:rounded-lg prose-blockquote:border-l-2 prose-blockquote:border-gray-200 prose-blockquote:pl-6 prose-hr:my-16 prose-a:text-gray-700 hover:prose-a:text-gray-900 dark:prose-headings:text-gray-100 dark:prose-p:text-gray-300 dark:prose-blockquote:border-gray-700 dark:prose-blockquote:text-gray-300 dark:prose-a:text-gray-400 dark:hover:prose-a:text-gray-200 " +
        className
      }
    >
      <ReactMarkdown
        components={{
          img: ({ node, src, ...props }) =>
            !ignoreImages ? (
              <figure className="my-12">
                <ASNextImage
                  className="mx-auto rounded-lg shadow-sm"
                  // @ts-ignore
                  width={900}
                  // @ts-ignore
                  height={600}
                  src={src as string}
                  {...props}
                  alt=""
                />
                {props.alt && (
                  <figcaption className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    {props.alt}
                  </figcaption>
                )}
              </figure>
            ) : (
              ""
            ),
          p: ({ node, ...props }) =>
            !ignoreSize ? (
              <p
                className="leading-[1.75] text-base text-gray-800 dark:text-gray-200 my-8"
                {...props}
              />
            ) : (
              <p className="font-normal leading-[1.75]" {...props} />
            ),
          h1: ({ node, ...props }) =>
            !ignoreSize ? (
              <h1
                className="text-4xl font-semibold text-center my-12 text-gray-900 dark:text-gray-100"
                {...props}
              />
            ) : (
              <p className="font-normal" {...props} />
            ),
          h2: ({ node, ...props }) =>
            !ignoreSize ? (
              <h2
                className="text-2xl font-medium mt-16 mb-8 text-gray-900 dark:text-gray-100"
                {...props}
              />
            ) : (
              <p className="font-normal" {...props} />
            ),
          h3: ({ node, ...props }) =>
            !ignoreSize ? (
              <h3
                className="text-xl font-medium mt-12 mb-6 text-gray-900 dark:text-gray-100"
                {...props}
              />
            ) : (
              <p className="font-normal" {...props} />
            ),
          ul: ({ node, ...props }) => (
            <ul
              className="my-8 ml-6 list-disc marker:text-gray-400 [&>li]:mt-3 [&>li]:leading-[1.75]"
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-2 border-gray-200 pl-8 text-gray-700 dark:text-gray-300 dark:border-gray-700 my-12"
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
    </div>
  );
}
