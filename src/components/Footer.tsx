import Link from 'next/link';
import { FC } from 'react';

interface Props {
  dark?: boolean;
  absolute?: boolean;
  left?: boolean;
}
const Footer: FC<Props> = ({
  dark = false,
  absolute = false,
  left = false,
}) => {
  return (
    <footer
      className={`footer w-full items-center py-6 ${
        dark ? '' : 'dark:bg-dark'
      } ${absolute ? 'fixed bottom-[-2px] pb-4' : ''}`}
    >
      <div className={`w-full ${dark ? 'text-gray-100' : 'text-dark'}`}>
        <p
          className={`w-full ${
            left ? 'text-left' : 'text-center'
          } dark:text-gray-100`}
        >
          <Link
            href='https://www.instagram.com/artscope.kr/'
            target='_blank'
            className='link'
          >
            {' '}
            <strong>Artscope</strong>
          </Link>{' '}
          by{' '}
          <Link
            className='link text-amber-300'
            href='https://www.instagram.com/media_xi/'
            target='_blank'
          >
            Media Xi
          </Link>{' '}
          x{' '}
          <Link
            href='https://art.geumjeong.go.kr'
            target='_blank'
            className={`link ${dark ? 'text-green-200' : 'text-cyan-500'}`}
          >
            금샘미술관
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
