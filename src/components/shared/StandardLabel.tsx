import { decode } from 'html-entities';
import lodash from 'lodash';

export default function StandardLabel({ label }: { label?: string }) {
  return (
    <>{label ? lodash.unescape(decode(label.replace(/<[^>]*>?/g, ''))) : ''}</>
  );
}

export const standardLabel = (label?: string) =>
  label ? lodash.unescape(decode(label.replace(/<[^>]*>?/g, ''))) : '';
