import Head from 'next/head';
import Link from 'next/link';
import { Fragment } from 'react';

const databaseId = process.env.NOTION_DATABASE_ID;
import Image from 'next/image';

import styles from './post.module.css';

import Seo from '../../components/Seo';
import TabLayout from '../../components/TabLayout';
import BottomBar from '../../components/TabLayout/BottomBar';
import { NavBar } from '../../components/TabLayout/NavBar';
import { getBlocks, getDatabase, getPage } from '../../utils/notion';

export const Text = ({ text }) => {
  if (!text) {
    return null;
  }
  return text.map((value) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value;
    return (
      <span
        className={[
          bold ? styles.bold : '',
          code ? styles.code : '',
          italic ? styles.italic : '',
          strikethrough ? styles.strikethrough : '',
          underline ? styles.underline : '',
        ].join(' ')}
        style={color !== 'default' ? { color } : {}}
        key={text.content}
      >
        {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
      </span>
    );
  });
};

const renderNestedList = (block) => {
  const { type } = block;
  const value = block[type];
  if (!value) return null;

  const isNumberedList = value.children[0].type === 'numbered_list_item';

  if (isNumberedList) {
    return <ol>{value.children.map((block) => renderBlock(block))}</ol>;
  }
  return <ul>{value.children.map((block) => renderBlock(block))}</ul>;
};

const renderBlock = (block) => {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case 'paragraph':
      return (
        <p>
          <Text text={value.rich_text} />
        </p>
      );
    case 'heading_1':
      return (
        <h1>
          <Text text={value.rich_text} />
        </h1>
      );
    case 'heading_2':
      return (
        <h2>
          <Text text={value.rich_text} />
        </h2>
      );
    case 'heading_3':
      return (
        <h3>
          <Text text={value.rich_text} />
        </h3>
      );
    case 'bulleted_list': {
      return <ul>{value.children.map((child) => renderBlock(child))}</ul>;
    }
    case 'numbered_list': {
      return <ol>{value.children.map((child) => renderBlock(child))}</ol>;
    }
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return (
        <li key={block.id}>
          <Text text={value.rich_text} />
          {!!value.children && renderNestedList(block)}
        </li>
      );
    case 'to_do':
      return (
        <div>
          <label htmlFor={id}>
            <input type='checkbox' id={id} defaultChecked={value.checked} />{' '}
            <Text text={value.rich_text} />
          </label>
        </div>
      );
    case 'toggle':
      return (
        <details>
          <summary>
            <Text text={value.rich_text} />
          </summary>
          {block.children?.map((child) => (
            <Fragment key={child.id}>{renderBlock(child)}</Fragment>
          ))}
        </details>
      );
    case 'child_page':
      return (
        <div className={styles.childPage}>
          <strong>{value.title}</strong>
          {block.children.map((child) => renderBlock(child))}
        </div>
      );
    case 'image':
      return (
        <figure>
          <Image
            src={
              value.type === 'external' ? value.external.url : value.file.url
            }
            alt={value.caption || ''}
            width={500}
            height={500}
            className='w-full'
          />
          {value.caption && (
            <figcaption>{value.caption[0]?.plain_text}</figcaption>
          )}
        </figure>
      );
    case 'divider':
      return <hr key={id} />;
    case 'quote':
      return <blockquote key={id}>{value.rich_text[0].plain_text}</blockquote>;
    case 'code':
      return (
        <pre className={styles.pre}>
          <code className={styles.code_block} key={id}>
            {value.rich_text[0].plain_text}
          </code>
        </pre>
      );
    case 'file':
      return (
        <figure>
          <div className={styles.file}>
            📎{' '}
            <Link
              href={
                value.type === 'external' ? value.external.url : value.file.url
              }
              passHref
            >
              {value.type === 'external'
                ? value.external.url
                : value.file.url
                    .split('/')
                    [
                      value.type === 'external'
                        ? value.external.url
                        : value.file.url.split('/').length - 1
                    ].split('?')[0]}
            </Link>
          </div>
          {value.caption && (
            <figcaption>{value.caption[0]?.plain_text}</figcaption>
          )}
        </figure>
      );
    case 'bookmark':
      return (
        <a href={value.url} target='_brank' className={styles.bookmark}>
          {value.url}
        </a>
      );
    case 'table': {
      return (
        <table className={styles.table}>
          <tbody>
            {block.children?.map((child, i) => {
              const RowElement =
                value.has_column_header && i === 0 ? 'th' : 'td';
              return (
                <tr key={child.id}>
                  {child.table_row?.cells?.map((cell, i) => {
                    return (
                      <RowElement key={`${cell.plain_text}-${i}`}>
                        <Text text={cell} />
                      </RowElement>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
    case 'column_list': {
      return (
        <div className={styles.row}>
          {block.children.map((block) => renderBlock(block))}
        </div>
      );
    }
    case 'column': {
      return <div>{block.children.map((child) => renderBlock(child))}</div>;
    }
    default:
      return `❌ Unsupported block (${
        type === 'unsupported' ? 'unsupported by Notion API' : type
      })`;
  }
};

export default function Post({ page, blocks }) {
  if (!page || !blocks) {
    return <div />;
  }
  return (
    <div>
      <Head>
        <title>{page.properties.title.title[0].plain_text}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <article>
        <Seo templateTitle='Blog' />
        <NavBar />
        <TabLayout>
          <h1 className={styles.name}>
            <Text text={page.properties.title.title} />
          </h1>
          <section>
            {blocks.map((block) => (
              <Fragment key={block.id}>{renderBlock(block)}</Fragment>
            ))}
          </section>
        </TabLayout>
        <BottomBar tab='playlist' />
      </article>
    </div>
  );
}

export const getStaticPaths = async () => {
  const database = await getDatabase(databaseId);
  return {
    paths: database.map((page) => ({ params: { id: page.id } })),
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const { id } = context.params;
  const page = await getPage(id);
  const blocks = await getBlocks(id);

  return {
    props: {
      page,
      blocks,
    },
    revalidate: 10,
  };
};
