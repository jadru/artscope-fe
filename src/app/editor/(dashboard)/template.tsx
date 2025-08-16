import Navbar from "@/components/Navbar";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar isEditor={true} />
      <main className="flex-grow px-4 md:px-6">{children}</main>
    </>
  );
}
