import React from 'react';
import { Progress } from 'antd';

interface MarketStatProgressProps {
  marketStat: { [key: string]: number } | null;
}
function MarketStatProgress({ marketStat }: MarketStatProgressProps) {
  return (
    <div>
      {marketStat ? (
        <div className="statistics">
          <Progress
            strokeWidth={16}
            percent={100 - marketStat.buy}
            successPercent={marketStat.sell}
            showInfo={false}
          />
          <div className="forecast-label">
            <span className="sell">
              판다 <strong>{marketStat.sell}%</strong>
            </span>
            <span className="hold">
              홀드 <strong>{marketStat.hold}%</strong>
            </span>
            <span className="buy">
              산다 <strong>{marketStat.buy}%</strong>
            </span>
          </div>
        </div>
      ) : (
        <div className="statistics">
          <Progress strokeWidth={16} percent={66.7} successPercent={33.3} showInfo={false} />
          <div className="forecast-label">
            <span className="sell">
              판다 <strong>- %</strong>
            </span>
            <span className="hold">
              홀드 <strong>- %</strong>
            </span>
            <span className="buy">
              산다 <strong>- %</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketStatProgress;
