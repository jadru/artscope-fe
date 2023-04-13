import Link from 'next/link';

const Footer = () => {
  return (
    <footer className='footer w-full items-center py-6'>
      <div className='w-full'>
        <p className='w-full text-center'>
          <strong>Artscope</strong> by{' '}
          <Link className='link-primary' href='#'>
            Media Xi
          </Link>{' '}
          x{' '}
          <Link
            href='https://art.geumjeong.go.kr'
            target='_blank'
            className='link text-slate-600'
          >
            금샘미술관
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
