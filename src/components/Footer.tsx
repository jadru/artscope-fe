import Link from "next/link";
import { FiCompass, FiInstagram } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="w-full border-t border-black/5 bg-white/80 text-sm text-gray-600 backdrop-blur dark:border-white/10 dark:bg-black/30 dark:text-gray-300">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-10">
        <nav
          aria-label="푸터 링크"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
        >
          <Link
            href="https://jadru.notion.site/Artscope-5d99f78df8c64d019bd21a02eb1f80d2?pvs=4"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gray-900 dark:hover:text-white"
          >
            가이드
          </Link>
          <Link
            href="https://jadru.notion.site/Artscope-6cd68452a7114d4facc175d70d20443b?pvs=4"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gray-900 dark:hover:text-white"
          >
            이용 약관
          </Link>
          <Link
            href="https://forms.gle/F9V9gppnKXXBRE4d6"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gray-900 dark:hover:text-white"
          >
            피드백
          </Link>
          <Link
            href="https://plip.kr/pcc/1bdbcbd7-0bde-4101-8ce2-cc4e1fc53eef/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gray-900 dark:hover:text-white"
          >
            개인정보 처리방침
          </Link>
        </nav>

        <div className="flex items-center justify-center gap-3 text-gray-500 dark:text-gray-300">
          <Link
            href="https://www.instagram.com/artscope.kr/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="transition-colors hover:text-gray-900 dark:hover:text-white"
          >
            <FiInstagram size={18} />
          </Link>
          <Link
            href="https://mediaxi.kr/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Mediaxi"
            className="transition-colors hover:text-gray-900 dark:hover:text-white"
          >
            <FiCompass size={18} />
          </Link>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          © 2024 Artscope.
        </p>
      </div>
    </footer>
  );
}
