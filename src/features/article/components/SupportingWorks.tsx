"use client";

import Link from "next/link";

import ASNextImage from "@/components/shared/ASNextImage";

interface SupportingWork {
  id: number;
  title: string;
  year: string;
  imageUrl: string;
  description?: string;
}

interface SupportingWorksProps {
  works: SupportingWork[];
}

export default function SupportingWorks({ works }: SupportingWorksProps) {
  if (works.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">
        Supporting Images/Videos
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {works.map((work) => (
          <Link
            key={work.id}
            href={`/article/${work.id}`}
            className="group block"
          >
            <div className="overflow-hidden rounded-lg bg-gray-200">
              <div className="relative aspect-square">
                {work.imageUrl ? (
                  <ASNextImage
                    src={work.imageUrl}
                    alt={work.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 300px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    이미지
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-medium text-gray-900">
                {work.title} - {work.year}
              </h3>
              {work.description && (
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {work.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
