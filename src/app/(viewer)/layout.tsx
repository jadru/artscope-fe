import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar theme='light' />
      <div className='container mx-auto min-h-[calc(100vh-10rem)] max-w-screen-lg pb-3'>
        {children}
      </div>
      <Footer />
    </>
  );
}
