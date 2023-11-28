const extractLinks = (
  text: string
): { type: 'text' | 'link'; value: string }[] => {
  const linkRegex = /(https:\/\/\S+)/g;
  const matches = text.match(linkRegex);

  if (!matches) {
    return [{ type: 'text', value: text }];
  }

  const result: { type: 'text' | 'link'; value: string }[] = [];

  let lastIndex = 0;
  for (const match of matches) {
    const startIndex = text.indexOf(match, lastIndex);
    if (startIndex > lastIndex) {
      // 링크 이전의 텍스트를 배열에 추가
      const textBeforeLink = text.substring(lastIndex, startIndex);
      result.push({ type: 'text', value: textBeforeLink });
    }

    // 링크를 배열에 추가
    result.push({ type: 'link', value: decodeURI(match) });

    lastIndex = startIndex + match.length;
  }

  // 마지막 링크 이후의 텍스트를 배열에 추가
  if (lastIndex < text.length) {
    const textAfterLink = text.substring(lastIndex);
    result.push({ type: 'text', value: textAfterLink });
  }

  return result;
};

export default extractLinks;
