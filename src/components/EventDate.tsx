import * as React from 'react';

type EventDateProps = {
  date: string;
};

function EventDate({ date }: EventDateProps) {
  // prettier-ignore
  const splited = date.split('-');
  return <span>{`${splited[0]}년 ${splited[1]}월 ${splited[2]}일`}</span>;
}

export default EventDate;
