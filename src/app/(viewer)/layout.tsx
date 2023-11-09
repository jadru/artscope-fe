import Navbar from '@/components/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar theme='light' />
      <div className='container mx-auto min-h-[calc(100vh-62px)] max-w-screen-md md:border-x'>
        {children}
      </div>
    </>
  );
}
