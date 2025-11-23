"use client";

import { useState } from "react";
import ASNextImage from "@/components/ASNextImage";
import Link from "next/link";
import { PortfolioProjectType } from "@/types/article";
import { standardLabel } from "@/components/StandardLabel";

type ProjectCardProps = {
  project: PortfolioProjectType;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const mainImage = project.mediaUrls[0] || "prod/images/default.jpg";
  const shortDesc = standardLabel(
    project.shortDescription ||
      project.content.replace(/<[^>]*>/g, "").slice(0, 100)
  );

  return (
    <Link
      href={`/article/${project.id}`}
      className="group block relative overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-800 transition-all duration-300 hover:shadow-2xl dark:hover:shadow-gray-700/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
        <ASNextImage
          src={mainImage}
          alt={standardLabel(project.title)}
          width={800}
          height={600}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />

        {/* Overlay on Hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
            <p className="text-sm font-light leading-relaxed line-clamp-3">
              {shortDesc}
            </p>
          </div>
        </div>

        {/* Featured Badge */}
        {project.isFeatured && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-900 dark:text-white">
            Featured
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-xl font-light text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
            {standardLabel(project.title)}
          </h3>
          {project.year && (
            <span className="text-sm text-gray-500 dark:text-gray-400 font-light flex-shrink-0">
              {project.year}
            </span>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 font-light">
          {project.series && (
            <p className="line-clamp-1">
              시리즈: {standardLabel(project.series)}
            </p>
          )}
          {project.medium && (
            <p className="line-clamp-1">{standardLabel(project.medium)}</p>
          )}
          {project.dimensions && (
            <p className="line-clamp-1">{standardLabel(project.dimensions)}</p>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="text-sm font-light">{project.views}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-sm font-light">{project.likes}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
