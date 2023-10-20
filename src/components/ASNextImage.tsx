import Image, { ImageProps } from 'next/image';

export default function ASNextImage(Props: ImageProps) {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      placeholder='blur'
      blurDataURL='data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBAB  bWyZJf74GZgAAAABJRU5ErkJggg=='
      unoptimized={
        typeof Props.src === 'string' ? Props.src.startsWith('http') : false
      }
      {...Props}
    />
  );
}
