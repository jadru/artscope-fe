import { ReactNode } from "react";

interface FormCardProps {
  title: string;
  children: ReactNode;
}

export default function FormCard({ title, children }: FormCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#1A1A1A]">
      <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          {title}
        </h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
