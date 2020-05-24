export const shuffle = <T>(a: T[]): T[] => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const getTargetEventDate = (now: Date, displayable: boolean = false): string => {
  if (now.getUTCHours() < 10) {
    now.setDate(now.getDate() - 1);
  }
  return formatEventDate(now, displayable);
};

export const formatEventDate = (d: Date, displayable: boolean): string => {
  const month = d.getMonth() < 9 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
  const date = d.getUTCDate() < 10 ? `0${d.getUTCDate()}` : `${d.getUTCDate()}`;

  return displayable
    ? `${d.getFullYear()}년 ${month}월 ${date}일`
    : `${d.getFullYear()}${month}${date}`;
};

export const eventDate2IsoString = (date: string): string => {
  return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
};

export const eventDate2Displayable = (date: string): string => {
  return `${date.slice(4, 6)}월 ${date.slice(6, 8)}일`;
};

export const calcAfterDate = (targetDate: string, after: string): string => {
  const afterMap: { [key: string]: number } = { after1: 1, after10: 10, after20: 20 };
  const isoString = eventDate2IsoString(targetDate);
  const date = new Date(isoString);
  date.setDate(date.getDate() + afterMap[after]);
  return formatEventDate(date, false);
};
