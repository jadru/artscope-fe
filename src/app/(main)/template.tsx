import Navbar from "@/components/Navbar";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex w-full flex-1 text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 text-white sm:px-6 md:px-8 md:py-12">
          {children}
        </div>
      </main>
    </>
  );
}
