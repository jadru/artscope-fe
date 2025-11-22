import Navbar from "@/components/Navbar";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 w-full">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 py-8 md:py-12">
          {children}
        </div>
      </main>
    </>
  );
}
