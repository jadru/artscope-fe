import Link from "next/link";
import { FiCompass, FiInstagram, FiMail } from "react-icons/fi";

export default function Footer() {
  const footerSections = [
    {
      title: "플랫폼",
      links: [
        { label: "작품 탐색", href: "/" },
        { label: "갤러리", href: "/gallery" },
        { label: "커뮤니티", href: "/simple" },
        { label: "작품 업로드", href: "/editor/dashboard" },
      ],
    },
    {
      title: "리소스",
      links: [
        {
          label: "가이드",
          href: "https://jadru.notion.site/Artscope-5d99f78df8c64d019bd21a02eb1f80d2?pvs=4",
          external: true,
        },
        {
          label: "피드백",
          href: "https://forms.gle/F9V9gppnKXXBRE4d6",
          external: true,
        },
        { label: "소개", href: "/about" },
      ],
    },
    {
      title: "법적 고지",
      links: [
        {
          label: "이용 약관",
          href: "https://jadru.notion.site/Artscope-6cd68452a7114d4facc175d70d20443b?pvs=4",
          external: true,
        },
        {
          label: "개인정보 처리방침",
          href: "https://plip.kr/pcc/1bdbcbd7-0bde-4101-8ce2-cc4e1fc53eef/privacy-policy",
          external: true,
        },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: FiInstagram,
      href: "https://www.instagram.com/artscope.kr/",
      label: "Instagram",
    },
    {
      icon: FiCompass,
      href: "https://mediaxi.kr/",
      label: "Mediaxi",
    },
  ];

  return (
    <footer className="w-full border-t border-black/5 bg-white/50 backdrop-blur-xl dark:border-white/5 dark:bg-black/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 메인 푸터 콘텐츠 */}
        <div className="grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          {/* 브랜드 섹션 */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              <span className="font-['Source_Code_Pro'] transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-300">
                Artscope
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              창의적인 예술가들의 작품과 생각을 공유하는 커뮤니티. 당신의 예술적
              영감을 세상과 나누세요.
            </p>
            {/* 소셜 링크 */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white dark:border-white/10 dark:text-gray-400 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                >
                  <social.icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* 링크 섹션들 */}
          {footerSections.map((section) => (
            <nav
              key={section.title}
              className="lg:col-span-2"
              aria-label={section.title}
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* 뉴스레터/연락 섹션 */}
          <div className="lg:col-span-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              소식 받기
            </h3>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              새로운 기능과 예술가 소식을 가장 먼저 받아보세요.
            </p>
            <div className="mt-4">
              <Link
                href="https://forms.gle/F9V9gppnKXXBRE4d6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100"
              >
                <FiMail size={14} />
                문의하기
              </Link>
            </div>
          </div>
        </div>

        {/* 하단 바 */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 py-8 dark:border-white/5 sm:flex-row">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} Artscope. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-500">
            <span>Made with ❤️ for artists</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
