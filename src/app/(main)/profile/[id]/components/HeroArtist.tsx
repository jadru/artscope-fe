"use client";

import { useState, useEffect } from "react";
import ASNextImage from "@/components/shared/ASNextImage";
import Link from "next/link";
import { standardLabel } from "@/components/shared/StandardLabel";

type HeroArtistProps = {
  name: string;
  tagline?: string;
  featuredImages: string[];
  snsUrl?: string;
  websiteUrl?: string;
};

export default function HeroArtist({
  name,
  tagline,
  featuredImages,
  snsUrl,
  websiteUrl,
}: HeroArtistProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  // 이미지 슬라이더
  useEffect(() => {
    if (featuredImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredImages.length]);

  // Parallax 효과
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 매우 미세한 parallax 효과 (양방향 모두 커버)
  const parallaxOffset = scrollY * 0.15;
  const blurAmount = scrollY * 0.01;
  return (
    <section className="relative h-[70vh] md:h-[80vh] lg:h-[90vh] min-h-[500px] max-h-[1000px] overflow-hidden bg-gray-950 -mt-8 md:-mt-12">
      {/* Featured Image with Parallax */}
      <div
        className="absolute w-full h-[130%] transition-transform duration-200 ease-out"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          filter: `brightness(0.8) contrast(1.2) blur(${blurAmount}px)`,
          top: "-15%",
        }}
      >
        {featuredImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <ASNextImage
              src={image}
              alt={`${name} featured work ${index + 1}`}
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end pb-16 md:pb-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          {/* Artist Name */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white mb-4 md:mb-6 tracking-tight">
            {name}
          </h1>

          {/* Social Links */}
          <div className="flex flex-wrap gap-4">
            {websiteUrl && (
              <Link
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-light text-sm hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                Website
              </Link>
            )}
            {snsUrl && (
              <Link
                href={snsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-light text-sm hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Instagram
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Slider Indicators */}
      {featuredImages.length > 1 && (
        <div className="absolute bottom-6 right-6 flex gap-2">
          {featuredImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Featured work ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
