import React from 'react';
import { Tag } from 'antd';

import Price from './Price';
import { StockInfo } from '../pages/HomePage';

import './StockInfoDisplayable.scss';

export type InfoExtent = 'head' | 'price' | 'all';

type StockInfoDisplayableProps = {
  stockInfo: StockInfo;
  infoExtent: InfoExtent;
};

function StockInfoDisplayable({
  stockInfo,
  infoExtent,
}: StockInfoDisplayableProps) {
  return (
    <div className="StockInfoDisplayable">
      <div className="info-head">
        <h3>{stockInfo.name}</h3>
        <span className="code">{stockInfo.code}</span>
        <Tag>{stockInfo.market}</Tag>
      </div>
      {infoExtent !== 'head' && (
        <div className="info-price">
          <Price value={stockInfo.price} />
        </div>
      )}
      {infoExtent === 'all' && (
        <ul className="info-all">
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
  );
}

export default StockInfoDisplayable;
