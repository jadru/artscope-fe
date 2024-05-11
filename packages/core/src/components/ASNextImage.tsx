import Image, { ImageProps } from 'next/image';

export default function ASNextImage(Props: ImageProps) {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      placeholder={Props.placeholder ?? 'blur'}
      blurDataURL={
        Props.blurDataURL ??
        'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
      }
      {...Props}
    />
  );
}
