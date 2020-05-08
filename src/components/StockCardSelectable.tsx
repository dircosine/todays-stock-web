import React from 'react';
import { Card, Button } from 'antd';

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
  isMobile: boolean;
}

function StockCardSelectable({
  stockInfo,
  chartScale,
  position,
  blind,
  showMoreInfo,
  onClick,
  isMobile,
}: StockCardSelectableProps) {
  const handleCardClick = () => {
    onClick(position);
  };

  return (
    <Card
      className="StockCardSelectable"
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
