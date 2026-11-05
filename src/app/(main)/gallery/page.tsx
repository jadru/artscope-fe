"use client";

import GalleryGrid from "@/features/gallery/components/GalleryGrid";

export default function GalleryPage() {
  return (
    <>
      {/* <SearchHeader onSearch={handleSearch} onFilterClick={handleFilterClick} /> */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">갤러리</h1>
        <GalleryGrid />
      </main>
    </>
  );
}
