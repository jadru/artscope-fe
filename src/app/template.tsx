import Navbar from "@/components/Navbar";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
    </>
  );
}
