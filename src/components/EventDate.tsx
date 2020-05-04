import * as React from 'react';

interface EventDateProps {
  date: string;
}

function EventDate({ date }: EventDateProps) {
  // prettier-ignore
  return <span>{`${date.slice(0, 4)}년 ${date.slice(4, 6)}월 ${date.slice(6, 8)}일`}</span>;
}

export default EventDate;
