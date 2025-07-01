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
    <ReactMarkdown
      // className={'markdown-viewer break-all space-y-2 ' + className}
      components={{
        img: ({ node, src, ...props }) =>
          !ignoreImages ? (
            <ASNextImage
              className="w-full rounded-lg"
              // @ts-ignore
              width={600}
              // @ts-ignore
              height={600}
              src={src as string}
              {...props}
              alt=""
            />
          ) : (
            ""
          ),
        // eslint-disable-next-line unused-imports/no-unused-vars
        p: ({ node, ...props }) =>
          !ignoreSize ? (
            <p
              className="leading-7 [&:not(:first-child)]:mt-6 break-keep"
              {...props}
            />
          ) : (
            <p className="font-normal break-keep" {...props} />
          ),
        // eslint-disable-next-line unused-imports/no-unused-vars
        h1: ({ node, ...props }) =>
          !ignoreSize ? (
            <h2
              className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance break-keep"
              {...props}
            />
          ) : (
            <p className="font-normal" {...props} />
          ),
        // eslint-disable-next-line unused-imports/no-unused-vars
        h2: ({ node, ...props }) =>
          !ignoreSize ? (
            <h3
              className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 break-keep"
              {...props}
            />
          ) : (
            <p className="font-normal" {...props} />
          ),
        // eslint-disable-next-line unused-imports/no-unused-vars
        h3: ({ node, ...props }) =>
          !ignoreSize ? (
            <h4
              className="scroll-m-20 text-2xl font-semibold tracking-tight break-keep"
              {...props}
            />
          ) : (
            <p className="font-normal" {...props} />
          ),
        // eslint-disable-next-line unused-imports/no-unused-vars
        ul: ({ node, ...props }) => (
          <ul
            className="my-6 ml-6 list-disc [&>li]:mt-2 break-keep"
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
  );
}
