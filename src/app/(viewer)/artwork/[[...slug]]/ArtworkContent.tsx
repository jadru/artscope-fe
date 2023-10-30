'use client';

import { convertNewlineToJSX } from '@toss/react';

export default function ArtworkContent({ content }: { content: string }) {
  return <>{convertNewlineToJSX(content)}</>;
}
