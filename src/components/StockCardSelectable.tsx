import React, { useState } from 'react';
import { Card, Spin } from 'antd';

import { StockInfo } from '../pages/HomePage';
import { Position } from './Template/HomeTemplate';

import './StockCardSelectable.scss';
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
  const [imgLoading, setImgLoading] = useState(true);

  const handleCardClick = () => {
    onClick(position);
  };

  const handleImgLoad = () => {
    setImgLoading(false);
  };

  return (
    <Card
      className="StockCardSelectable"
      bodyStyle={{ paddingRight: 8, paddingLeft: 8 }}
      onClick={handleCardClick}
      hoverable
    >
      <img
        alt={stockInfo.name + ' chart'}
        src={`https://ssl.pstatic.net/imgfinance/chart/item/candle/${chartScale}/${stockInfo.code}.png`}
        width="100%"
        onLoad={handleImgLoad}
      />
      {imgLoading ? (
        <div className="spinner">
          <Spin />
        </div>
      ) : (
        <StockInfoDisplayable
          stockInfo={stockInfo}
          infoExtent={['head', 'chart', 'price', 'more']}
        />
      )}
    </Card>
  );
}

export default StockCardSelectable;
