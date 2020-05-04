import React, { useState, useEffect } from 'react';
import { Spin, Skeleton, Divider } from 'antd';

import './MarketInfoDisplayable.scss';

interface MarketInfoDisplayableProps {
  market: 'kospi' | 'kosdaq';
  chartScale?: 'day' | 'week' | 'month';
}

function MarketInfoDisplayable({
  market,
  chartScale,
}: MarketInfoDisplayableProps) {
  const [imgLoading, setImgLoading] = useState(false);

  useEffect(() => {
    setImgLoading(!!market);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market]);

  const handleImgLoad = () => {
    setImgLoading(false);
  };

  if (imgLoading) {
    return (
      <>
        {/* Dummy lender for onLoad/onFail trigger */}
        <img
          alt={market + ' chart'}
          src={`https://ssl.pstatic.net/imgfinance/chart/mobile/candle/${chartScale}/${market.toUpperCase()}_end.png`}
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
    <div className="Market.toUpperCase()InfoDisplayable">
      <div className="info-head">
        <strong className="name">
          {market === 'kospi' ? '코스피' : '코스닥'}
        </strong>
      </div>
      <Divider style={{ margin: '10px 0px' }} />

      {!imgLoading && (
        <img
          alt={market + ' chart'}
          src={`https://ssl.pstatic.net/imgfinance/chart/mobile/candle/${chartScale}/${market.toUpperCase()}_end.png`}
          width="100%"
        />
      )}
    </div>
  );
}

MarketInfoDisplayable.defaultProps = {
  chartScale: 'day',
};

export default MarketInfoDisplayable;
