export const shuffle = <T>(a: T[]): T[] => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const getYYYYMMDD = (d: Date): string => {
  const month = d.getMonth() < 9 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
  const date = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;

  return `${d.getFullYear()}-${month}-${date}`;
};

export const getTargetEventDate = (now: Date): string => {
  if (now.getUTCHours() < 10) {
    now.setDate(now.getDate() - 1);
  }
  return formatEventDate(now);
};

export const formatEventDate = (d: Date): string => {
  const month = d.getMonth() < 9 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
  const date = d.getUTCDate() < 10 ? `0${d.getUTCDate()}` : `${d.getUTCDate()}`;

  return `${d.getFullYear()}${month}${date}`;
};
