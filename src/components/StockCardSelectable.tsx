import React from 'react';
import { Card, Button } from 'antd';

import { Position } from './templates/TournamentTemplate';

import StockInfoDisplayable from './StockInfoDisplayable';
import { StockInfo } from '../lib/stock';

interface StockCardSelectableProps {
  className?: string;
  stockInfo: StockInfo;
  chartScale: 'day' | 'week' | 'month';
  position: Position;
  blind: boolean;
  showMoreInfo: boolean;
  isMobile: boolean;
  onClick: (position: Position) => void;
}

function StockCardSelectable({
  className,
  stockInfo,
  chartScale,
  position,
  blind,
  showMoreInfo,
  isMobile,
  onClick,
}: StockCardSelectableProps) {
  const handleCardClick = () => {
    onClick(position);
  };

  if (!stockInfo) return <div></div>;

  return (
    <Card
      className={`StockCardSelectable ${className}`}
      style={{ flex: 1, borderRadius: 4, height: '100%' }}
      bodyStyle={{ paddingRight: 8, paddingLeft: 8 }}
      onClick={!isMobile ? handleCardClick : undefined}
      hoverable
    >
      <StockInfoDisplayable
        stockInfo={stockInfo}
        infoExtent={['head', 'chart', 'price', 'more']}
        hideInfo={blind}
        showMoreInfo={showMoreInfo}
        chartScale={chartScale}
      />
      {isMobile && (
        <div style={{ textAlign: 'end', paddingRight: 16 }}>
          <Button size="large" type="primary" shape="round" onClick={handleCardClick}>
            선 택
          </Button>
        </div>
      )}
    </Card>
  );
}

export default StockCardSelectable;
