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
