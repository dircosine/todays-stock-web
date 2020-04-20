import * as React from 'react';

type EventDateProps = {
  date: Date;
};

function EventDate({ date }: EventDateProps) {
  // prettier-ignore
  return <span>{`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`}</span>;
}

export default EventDate;
