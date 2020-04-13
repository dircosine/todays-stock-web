import React from 'react';
import { Card, Tag } from 'antd';

import { StockInfo } from '../pages/HomePage';
import { Position } from './Template/HomeTemplate';

type StockCardProps = {
  stockInfo: StockInfo;
  chartScale: 'day' | 'week' | 'month';
  position: 'left' | 'right';
  onClick: (position: Position) => void;
};

function StockCard({
  stockInfo,
  chartScale,
  position,
  onClick,
}: StockCardProps) {
  const handleCardClick = () => {
    onClick(position);
  };

  return (
    <Card
      bodyStyle={{ paddingRight: 8, paddingLeft: 8 }}
      onClick={handleCardClick}
      hoverable
    >
      <img
        alt="chart"
        src={`https://ssl.pstatic.net/imgfinance/chart/item/candle/${chartScale}/${stockInfo.code}.png`}
        width="100%"
      />
      <div>
        <strong>{stockInfo.name}</strong>
        <span>{stockInfo.code}</span>
        <Tag>{stockInfo.market}</Tag>
      </div>
    </Card>
  );
}

export default StockCard;
