"use client";

import GalleryGrid from "@/features/gallery/components/GalleryGrid";

export default function GalleryPage() {
  return (
    <>
      {/* <SearchHeader onSearch={handleSearch} onFilterClick={handleFilterClick} /> */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        <GalleryGrid />
      </main>
    </>
  );
}
