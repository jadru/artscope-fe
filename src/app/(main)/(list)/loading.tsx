import { Loader2, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        {/* Animated Icons */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Main Spinner */}
          <Loader2 className="h-12 w-12 animate-spin text-gray-400 dark:text-gray-600" />

          {/* Sparkle Decorations */}
          <Sparkles className="absolute -left-8 -top-2 h-5 w-5 animate-pulse text-gray-300 dark:text-gray-700" />
          <Sparkles className="absolute -right-8 -bottom-2 h-4 w-4 animate-pulse text-gray-300 delay-150 dark:text-gray-700" />
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
            로딩 중
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            작품을 불러오고 있습니다...
          </p>
        </div>

        {/* Animated Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-600"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-100 dark:bg-gray-600"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-200 dark:bg-gray-600"></div>
        </div>
      </div>
    </div>
  );
}
