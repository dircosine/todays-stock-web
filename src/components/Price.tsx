import React from 'react';

import './Price.scss';

type PriceProps = {
  value: string;
  color?: 'red' | 'blue';
};

function Price({ value, color }: PriceProps) {
  return (
    <strong className={`Price ${color}`}>
      <em>{value}</em>
    </strong>
  );
}

export default Price;
