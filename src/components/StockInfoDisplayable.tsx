import React, { useState, useEffect } from 'react';
import { Tag, Spin, Skeleton, Divider } from 'antd';

import Price from './Price';
import { StockInfo } from '../pages/HomePage';

import './StockInfoDisplayable.scss';

export type InfoSection = 'head' | 'chart' | 'price' | 'more';

type StockInfoDisplayableProps = {
  stockInfo: StockInfo;
  chartScale?: 'day' | 'week' | 'month';
  hideInfo?: boolean;
  infoExtent: InfoSection[];
};

function StockInfoDisplayable({
  stockInfo,
  chartScale,
  hideInfo,
  infoExtent,
}: StockInfoDisplayableProps) {
  const [imgLoading, setImgLoading] = useState(infoExtent.includes('chart'));

  useEffect(() => {
    setImgLoading(infoExtent.includes('chart'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockInfo]);

  const handleImgLoad = () => {
    setImgLoading(false);
  };

  if (imgLoading) {
    return (
      <>
        {/* Dummy lender for onLoad/onFail trigger */}
        <img
          alt={stockInfo.name + ' chart'}
          src={`https://ssl.pstatic.net/imgfinance/chart/item/candle/${chartScale}/${stockInfo.code}.png`}
          width="0%"
          onLoad={handleImgLoad}
        />
        <div className="spinner">
          <Spin />
        </div>
        <div className="info-more">
          <Skeleton title={false} paragraph={{ rows: 4 }} active />
        </div>
      </>
    );
  }
  return (
    <div className="StockInfoDisplayable">
      {infoExtent.includes('head') && (
        <div className="info-head">
          {hideInfo ? (
            <strong className="name">???</strong>
          ) : (
            <>
              <strong className="name">{stockInfo.name}</strong>
              <span className="code">{stockInfo.code}</span>
            </>
          )}
          <Tag className="market">{stockInfo.market}</Tag>
        </div>
      )}
      <Divider style={{ margin: '10px 0px' }} />
      {infoExtent.includes('chart') && (
        <img
          alt={stockInfo.name + ' chart'}
          src={`https://ssl.pstatic.net/imgfinance/chart/item/candle/${chartScale}/${stockInfo.code}.png`}
          width="100%"
        />
      )}
      {infoExtent.includes('price') && (
        <div className="info-price">
          <Price value={stockInfo.price} />
        </div>
      )}
      {infoExtent.includes('more') && (
        <div className="info-more">
          {hideInfo ? (
            <Skeleton title={false} paragraph={{ rows: 4 }} />
          ) : (
            <ul>
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
    </div>
  );
}

StockInfoDisplayable.defaultProps = {
  chartScale: 'day',
  hideInfo: false,
};

export default StockInfoDisplayable;
