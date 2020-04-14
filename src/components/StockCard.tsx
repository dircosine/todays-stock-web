import React from 'react';
import { Card } from 'antd';

import { StockInfo } from '../pages/HomePage';
import StockInfoDisplayable, { InfoSection } from './StockInfoDisplayable';

type StockCardProps = {
  className?: string | undefined;
  stockInfo: StockInfo;
  showChart: boolean;
  infoExtent: InfoSection[];
};

function StockCard({
  className,
  stockInfo,
  showChart,
  infoExtent,
}: StockCardProps) {
  return (
    <Card
      className={className}
      style={{ height: '100%' }}
      bodyStyle={{ paddingRight: 8, paddingLeft: 8 }}
      hoverable
    >
      {showChart && (
        <img
          alt={stockInfo.name + ' chart'}
          src={`https://ssl.pstatic.net/imgfinance/chart/item/candle/day/${stockInfo.code}.png`}
          width="100%"
        />
      )}

      {/* <StockInfoDisplayable stockInfo={stockInfo} infoExtent={infoExtent} /> */}
    </Card>
  );
}

export default StockCard;
