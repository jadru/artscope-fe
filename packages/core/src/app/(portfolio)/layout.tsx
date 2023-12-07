import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className='container mx-auto min-h-[calc(100vh-10rem)] max-w-screen-lg'>
        {children}
      </div>
      <Footer />
    </>
  );
}
