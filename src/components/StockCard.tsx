import React from 'react';
import { Card, Tag } from 'antd';

import { StockInfo } from '../pages/HomePage';
import Price from './Price';

type StockCardProps = {
  className?: string | undefined;
  stockInfo: StockInfo;
  showChart: boolean;
  showInfoType?: 'none' | 'head' | 'all';
};

function StockCard({
  className,
  stockInfo,
  showChart,
  showInfoType,
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

      {showInfoType !== 'none' && (
        <div className="info">
          <div className="info-head">
            <h3>{stockInfo.name}</h3>
            <span className="code">{stockInfo.code}</span>
            <Tag>{stockInfo.market}</Tag>
          </div>
          {showInfoType === 'all' && (
            <ul className="info-body">
              <li>
                <Price value={stockInfo.price} />
              </li>
              <li>
                시가총액
                <strong>{stockInfo.cap}</strong>억원 / {stockInfo.market}
                <strong>{stockInfo.capRank}</strong>위
              </li>
              <li>
                상장주식수
                <strong>{stockInfo.amountOfListed}</strong>
              </li>
              <li>
                52주 최고 <strong>{stockInfo.week52high}</strong> / 최저{' '}
                <strong>{stockInfo.week52low}</strong>
              </li>
              <li>
                PER
                <strong>{stockInfo.per}</strong>
                (업종평균 {stockInfo.industryPer})
              </li>
              <li>
                PBR
                <strong>{stockInfo.pbr}</strong>
              </li>
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}

StockCard.defaultProps = {
  showInfoType: 'none',
};

export default StockCard;
