import { MainNavbar, MainFooter } from "@/components/layout";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-[#0A0A0A]">
      <MainNavbar />
      <main className="flex-grow px-4 md:px-6">{children}</main>
      <MainFooter />
    </div>
  );
}
