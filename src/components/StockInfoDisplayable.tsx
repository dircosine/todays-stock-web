import React, { useState, useEffect } from 'react';
import { Tag, Spin, Divider } from 'antd';
import PriceInfoDisplay from './PriceInfoDisplay';
import './StockInfoDisplayable.scss';
import MoreInfoDisplay from './MoreInfoDisplay';
import { StockInfo } from '../lib/stock';
import { useQuery } from '@apollo/react-hooks';
import { TOURNAMENT_PAGE } from '../lib/queries';

export type InfoSection = 'head' | 'chart' | 'price' | 'more';

interface StockInfoDisplayableProps {
  stockInfo: StockInfo;
  chartScale?: 'day' | 'week' | 'month';
  hideInfo?: boolean;
  showMoreInfo?: boolean;
  infoExtent: InfoSection[];
}

function StockInfoDisplayable({
  stockInfo,
  chartScale,
  hideInfo,
  showMoreInfo,
  infoExtent,
}: StockInfoDisplayableProps) {
  const [imgLoading, setImgLoading] = useState(infoExtent.includes('chart'));
  const { data } = useQuery(TOURNAMENT_PAGE, { fetchPolicy: 'cache-first' });
  const eventDate = data.getTodaysTournament.eventDate;

  useEffect(() => {
    setImgLoading(infoExtent.includes('chart'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockInfo]);

  const handleImgLoad = () => {
    setImgLoading(false);
  };

  const s3bucket =
    process.env.NODE_ENV === 'production' ? 'res-todaysstock' : 'res-todaysstock-dev';

  const imgSrc =
    chartScale === 'day'
      ? `https://${s3bucket}.s3.ap-northeast-2.amazonaws.com/${eventDate}/today/charts/${eventDate}_${stockInfo.code}_day.png`
      : `https://ssl.pstatic.net/imgfinance/chart/item/candle/${chartScale}/${stockInfo.code}.png`;

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
        <div className="img-wrap">
          <img
            className="chart"
            alt={stockInfo.name + ' chart'}
            src={imgSrc}
            width="100%"
            onLoad={handleImgLoad}
            hidden={imgLoading}
          />
          {imgLoading && (
            <div className="spinner">
              <Spin />
            </div>
          )}
        </div>
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
