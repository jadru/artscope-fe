export const stringToPhoneNumber = (phoneNumber: string): string =>
  phoneNumber
    .replace(/[^0-9]/g, '')
    .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, '$1-$2-$3');

export function removeMarkdown(markdownText: string): string {
  // 1. 인라인 코드 및 코드 블록 제거
  let text = markdownText.replace(/(```\s*[\w\W]+?\s*```)|(`[\w\W]+?`)/gm, '');
  // 2. 이미지 및 링크 제거
  text = text
    .replace(/!\[[^\]]*\]\([^\)]+\)/gm, '')
    .replace(/\[[^\]]+\]\([^\)]+\)/gm, '');
  // 3. 헤더, 굵은 글씨, 이탤릭, 취소선 제거
  text = text.replace(
    /(#{1,6} )|(\*\*|__)(.*?)\1|(\*|_)(.*?)\4|~~(.*?)~~/gm,
    '$3$5$6'
  );
  // 4. 리스트 항목 제거
  text = text.replace(/^\s*[\-\+]\s+/gm, '').replace(/^\s*\d+\.\s+/gm, '');
  // 5. 블록인용 부호 제거
  text = text.replace(/^\s*>+\s+/gm, '');
  // 6. 추가 줄바꿈 제거
  text = text.replace(/\n{2,}/g, '\n\n');
  // 7. HTML 태그 제거
  text = text.replace(/<[^>]*>/g, '');

  return text;
}
