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
        "prose prose-lg max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-p:text-lg prose-p:leading-relaxed prose-img:rounded-xl prose-img:shadow-md prose-blockquote:italic prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-hr:my-12 prose-a:text-blue-600 hover:prose-a:underline dark:prose-invert " +
        className
      }
    >
      <ReactMarkdown
        components={{
          img: ({ node, src, ...props }) =>
            !ignoreImages ? (
              <figure className="my-8">
                <ASNextImage
                  className="mx-auto rounded-xl shadow-md"
                  // @ts-ignore
                  width={900}
                  // @ts-ignore
                  height={600}
                  src={src as string}
                  {...props}
                  alt=""
                />
                {props.alt && (
                  <figcaption className="mt-2 text-center text-sm text-gray-500 italic">
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
                className="leading-relaxed text-lg text-gray-800 dark:text-gray-200 my-6"
                {...props}
              />
            ) : (
              <p className="font-normal" {...props} />
            ),
          h1: ({ node, ...props }) =>
            !ignoreSize ? (
              <h1
                className="text-5xl font-extrabold tracking-tight text-center my-8 font-serif"
                {...props}
              />
            ) : (
              <p className="font-normal" {...props} />
            ),
          h2: ({ node, ...props }) =>
            !ignoreSize ? (
              <h2
                className="text-3xl font-bold mt-12 mb-6 border-b pb-2 font-serif"
                {...props}
              />
            ) : (
              <p className="font-normal" {...props} />
            ),
          h3: ({ node, ...props }) =>
            !ignoreSize ? (
              <h3
                className="text-2xl font-semibold mt-8 mb-4 font-serif"
                {...props}
              />
            ) : (
              <p className="font-normal" {...props} />
            ),
          ul: ({ node, ...props }) => (
            <ul
              className="my-6 ml-6 list-disc marker:text-gray-500 [&>li]:mt-2"
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 pl-4 italic text-gray-700 dark:text-gray-300 my-8"
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
