import React from 'react';
import { Tag, Divider } from 'antd';
import PriceInfoDisplay from './PriceInfoDisplay';
import './StockInfoDisplayable.scss';
import MoreInfoDisplay from './MoreInfoDisplay';
import { StockInfo } from '../lib/stock';
import { useQuery } from '@apollo/react-hooks';
import { TOURNAMENT_PAGE } from '../lib/queries';
import ImgLoadable from './ImgLoadable';

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
  const { data } = useQuery(TOURNAMENT_PAGE, { fetchPolicy: 'cache-first' });
  const eventDate = data.getTodaysTournament.eventDate;

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
      {infoExtent.includes('chart') && <ImgLoadable src={imgSrc} alt={stockInfo.name + ' chart'} />}
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
