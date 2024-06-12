import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatTimestamp = (timestamp: string) => {
  const date = dayjs(timestamp);
  const now = dayjs();
  const differenceInDays = now.diff(date, "day");

  if (differenceInDays < 1) {
    return date.fromNow();
  } else {
    return date.format("YYYY-MM-DD HH:mm");
  }
};
