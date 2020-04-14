import React from 'react';
import { Card } from 'antd';

import { StockInfo } from '../pages/HomePage';
import { Position } from './templates/HomeTemplate';

import StockInfoDisplayable from './StockInfoDisplayable';

type StockCardSelectableProps = {
  stockInfo: StockInfo;
  chartScale: 'day' | 'week' | 'month';
  position: Position;
  onClick: (position: Position) => void;
};

function StockCardSelectable({
  stockInfo,
  chartScale,
  position,
  onClick,
}: StockCardSelectableProps) {
  const handleCardClick = () => {
    onClick(position);
  };

  return (
    <Card
      className="StockCardSelectable"
      style={{ flex: 1 }}
      bodyStyle={{ paddingRight: 8, paddingLeft: 8 }}
      onClick={handleCardClick}
      hoverable
    >
      <StockInfoDisplayable
        stockInfo={stockInfo}
        infoExtent={['head', 'chart', 'price', 'more']}
        chartScale={chartScale}
      />
    </Card>
  );
}

export default StockCardSelectable;
