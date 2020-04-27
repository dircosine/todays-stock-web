import React from 'react';
import { Card } from 'antd';

import { Position } from './templates/TournamentTemplate';

import StockInfoDisplayable from './StockInfoDisplayable';
import { StockInfo } from '../lib/stock';

interface StockCardSelectableProps {
  stockInfo: StockInfo;
  chartScale: 'day' | 'week' | 'month';
  position: Position;
  blind: boolean;
  showMoreInfo: boolean;
  onClick: (position: Position) => void;
}

function StockCardSelectable({
  stockInfo,
  chartScale,
  position,
  blind,
  showMoreInfo,
  onClick,
}: StockCardSelectableProps) {
  const handleCardClick = () => {
    onClick(position);
  };

  return (
    <Card
      className="StockCardSelectable"
      style={{ flex: 1, borderRadius: 4 }}
      bodyStyle={{ paddingRight: 8, paddingLeft: 8 }}
      onClick={handleCardClick}
      hoverable
    >
      <StockInfoDisplayable
        stockInfo={stockInfo}
        infoExtent={['head', 'chart', 'price', 'more']}
        hideInfo={blind}
        showMoreInfo={showMoreInfo}
        chartScale={chartScale}
      />
    </Card>
  );
}

export default StockCardSelectable;
