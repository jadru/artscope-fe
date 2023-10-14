const timeCaculatortoKO = (from: Date | null) => {
  if (!from) {
    return undefined;
  }
  const time = new Date(String(from));
  const now = new Date();
  const diff = now.getTime() - time.getTime();
  const diffDay = diff / (1000 * 60 * 60 * 24);
  const diffHour = diff / (1000 * 60 * 60);

  if (diffDay > 365) {
    return time.toLocaleString('ko-KR');
  }
  if (diffDay > 30) {
    return time.toLocaleString('ko-KR');
  }
  if (diffDay > 1) {
    return Math.floor(diffDay) + '일 전';
  }
  if (diffHour > 1) {
    return Math.floor(diffHour) + '시간 전';
  }
  if (diff > 1300 * 60) {
    return Math.floor(diff / (1000 * 60)) + '분 전';
  }
  return '방금 전';
};

export { timeCaculatortoKO };
