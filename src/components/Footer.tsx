import Link from 'next/link';
import { FC } from 'react';

interface Props {
  dark?: boolean;
  absolute?: boolean;
}
const Footer: FC<Props> = ({ dark = false, absolute = false }) => {
  return (
    <footer
      className={`footer w-full items-center py-6 ${
        dark ? '' : 'dark:bg-dark'
      } ${absolute ? 'fixed bottom-[-2px] pb-4' : ''}`}
    >
      <div className={`w-full ${dark ? 'text-gray-100' : 'text-dark'}`}>
        <p className='w-full text-center dark:text-gray-100'>
          <strong>Artscope</strong> by{' '}
          <Link className='link text-violet-400' href='#'>
            Media Xi
          </Link>{' '}
          x{' '}
          <Link
            href='https://art.geumjeong.go.kr'
            target='_blank'
            className='link text-cyan-500'
          >
            금샘미술관
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
