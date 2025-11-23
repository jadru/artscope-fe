"use client";

import { PortfolioProjectType } from "@/types/article";
import ProjectCard from "./ProjectCard";

type FeaturedPortfolioGridProps = {
  projects: PortfolioProjectType[];
  title?: string;
  showAll?: boolean;
};

export default function FeaturedPortfolioGrid({
  projects,
  title = "Featured Works",
  showAll = false,
}: FeaturedPortfolioGridProps) {
  // Featured works first, then others
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return (
      new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
    );
  });

  const displayProjects = showAll ? sortedProjects : sortedProjects.slice(0, 6);

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <div className="w-24 h-px bg-gray-900 dark:bg-gray-100" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          {displayProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Show More Button */}
        {!showAll && projects.length > 6 && (
          <div className="mt-12 md:mt-16 text-center">
            <button
              onClick={() => {
                // This would typically scroll to full portfolio or navigate
                const portfolioSection = document.getElementById("all-works");
                portfolioSection?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-8 py-4 border border-gray-300 dark:border-gray-600 rounded-full text-gray-900 dark:text-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 hover:border-gray-900 dark:hover:border-white transition-all duration-300 font-light"
            >
              <span>View All Works</span>
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
