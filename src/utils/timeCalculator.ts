import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const timeCalculatorKO = (date: Date) => {
  return formatDistanceToNow(date, { addSuffix: true, locale: ko });
};

const editAndPostTimeCalculatorKO = (
  createdTime: Date,
  editedTime?: Date | null
) => {
  if (!editedTime || createdTime === editedTime) {
    return timeCalculatorKO(createdTime);
  }
  return `${timeCalculatorKO(editedTime)} 수정`;
};

const shortTimeCalculatorKO = (date: Date) => {
  const d = new Date(date);
  const now = Date.now();
  const diff = (now - d.getTime()) / 1000;
  if (diff < 60) {
    return "방금 전 ";
  }
  if (diff < 60 * 60 * 24 * 14) {
    return formatDistanceToNow(d, { addSuffix: true, locale: ko });
  }
  return format(d, "PP", { locale: ko }); // 날짜 포맷
};

const editAndPostShortCalculatorKO = (
  createdTime: Date,
  editedTime?: Date | null
) => {
  if (!editedTime || createdTime === editedTime) {
    return shortTimeCalculatorKO(createdTime);
  }
  return `${shortTimeCalculatorKO(editedTime)} 수정`;
};

const KOR_TIMEZONE = 9 * 60 * 60 * 1000;

export {
  editAndPostShortCalculatorKO,
  editAndPostTimeCalculatorKO,
  KOR_TIMEZONE,
  shortTimeCalculatorKO,
  timeCalculatorKO,
};
