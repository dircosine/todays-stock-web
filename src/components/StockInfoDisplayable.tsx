import React, { useState, useEffect } from 'react';
import { Tag, Spin, Skeleton, Divider } from 'antd';

import PriceInfoDisplay from './PriceInfoDisplay';
import { StockInfo } from '../pages/TournamentPage';

import './StockInfoDisplayable.scss';
import MoreInfoDisplay from './MoreInfoDisplay';

export type InfoSection = 'head' | 'chart' | 'price' | 'more';

type StockInfoDisplayableProps = {
  stockInfo: StockInfo;
  chartScale?: 'day' | 'week' | 'month';
  hideInfo?: boolean;
  showMoreInfo?: boolean;
  infoExtent: InfoSection[];
};

function StockInfoDisplayable({
  stockInfo,
  chartScale,
  hideInfo,
  showMoreInfo,
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
              <h3 style={{ display: 'inline' }}>
                <strong className="name">{stockInfo.name}</strong>
              </h3>
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
          <PriceInfoDisplay price={stockInfo.price} />
        </div>
      )}
      {infoExtent.includes('more') && showMoreInfo && !hideInfo && (
        <MoreInfoDisplay moreInfo={stockInfo.more} market={stockInfo.market} />
      )}
    </div>
  );
}

StockInfoDisplayable.defaultProps = {
  chartScale: 'day',
  hideInfo: false,
  moreInfo: false,
  showMoreInfo: false,
};

export default StockInfoDisplayable;
