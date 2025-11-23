"use client";

import { standardLabel } from "@/components/StandardLabel";

type HistoryTimelineProps = {
  history?: string;
};

export default function HistoryTimeline({ history }: HistoryTimelineProps) {
  if (!history || !history.trim()) return null;

  // history를 줄바꿈으로 나누기
  const lines = history.split("\n").filter((line) => line.trim());

  // 각 줄을 분류
  const parsedLines = lines.map((line) => {
    const trimmed = line.trim();

    // 섹션 헤더 감지 (개인전, 단체전, 레지던시 등)
    if (
      trimmed === "개인전" ||
      trimmed === "단체전" ||
      trimmed === "그룹전" ||
      trimmed === "레지던스" ||
      trimmed === "레지던시" ||
      trimmed === "수상" ||
      trimmed === "전시" ||
      trimmed === "Solo Exhibition" ||
      trimmed === "Group Exhibition" ||
      trimmed === "Residency" ||
      trimmed === "Award"
    ) {
      return {
        type: "header" as const,
        content: trimmed,
      };
    }

    // 연도 추출 (2023, 2021-2022 등)
    const yearMatch = trimmed.match(/^(\d{4})(?:[-–]\d{4})?\s*,?\s*/);
    if (yearMatch) {
      return {
        type: "entry" as const,
        year: yearMatch[1],
        content: trimmed.replace(yearMatch[0], "").trim(),
        fullContent: trimmed,
      };
    }

    // 일반 텍스트
    return {
      type: "text" as const,
      content: trimmed,
    };
  });

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mb-4">
            Exhibition & Career
          </h2>
          <div className="w-24 h-px bg-gray-900 dark:bg-gray-100" />
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {parsedLines.map((line, index) => {
            if (line.type === "header") {
              return (
                <div
                  key={index}
                  className="mt-12 first:mt-0 mb-6 flex items-center gap-4"
                >
                  <h3 className="text-2xl font-light text-gray-900 dark:text-white">
                    {standardLabel(line.content)}
                  </h3>
                  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
                </div>
              );
            }

            if (line.type === "entry") {
              return (
                <div
                  key={index}
                  className="relative border-l-2 border-gray-200 dark:border-gray-700 pb-6 last:pb-0 group hover:bg-gray-100 dark:hover:bg-gray-700 -ml-4 pl-16 pr-4 py-4 rounded-lg transition-colors duration-200"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-6 -translate-x-1/2 w-3 h-3 rounded-full bg-gray-900 dark:bg-gray-100 ring-4 ring-white dark:ring-gray-800 group-hover:ring-gray-100 dark:group-hover:ring-gray-700 transition-colors" />

                  {/* Year Badge */}
                  <div className="mb-3">
                    <span className="inline-block px-4 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-900 dark:text-white">
                      {line.year}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                    {standardLabel(line.content)}
                  </div>
                </div>
              );
            }

            if (line.type === "text") {
              return (
                <div
                  key={index}
                  className="border-l-2 border-gray-200 dark:border-gray-700 pb-4 last:pb-0 -ml-4 pl-16 pr-4 py-2"
                >
                  <div className="text-gray-600 dark:text-gray-400 leading-relaxed font-light text-sm">
                    {standardLabel(line.content)}
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </section>
  );
}
