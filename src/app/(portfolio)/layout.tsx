import Navbar from '@/components/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar theme='light' />
      <div>{children}</div>
    </>
  );
}
