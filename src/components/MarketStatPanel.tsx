import React, { useState } from 'react';
import { Tabs, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';

import './MarketStatPanel.scss';
import { MarketStat } from '../lib/stock';
import MarketStatProgress from './MarketStatProgress';

type ChartScale = 'day' | 'week' | 'month';

interface MarketStatPanelProps {
  marketStat: MarketStat | null;
}

function MarketStatPanel({ marketStat }: MarketStatPanelProps) {
  const [chartScaleMarket, setChartScaleMarket] = useState<ChartScale>('day');

  const handleScaleChange = (e: RadioChangeEvent) => {
    e.preventDefault();
    setChartScaleMarket(e.target.value);
  };

  return (
    <Tabs
      defaultActiveKey="kospi"
      size="small"
      type="card"
      tabBarExtraContent={
        <div style={{ textAlign: 'end' }}>
          <Radio.Group onChange={handleScaleChange} defaultValue={chartScaleMarket}>
            <Radio.Button value="day">일</Radio.Button>
            <Radio.Button value="week">주</Radio.Button>
            <Radio.Button value="month">월</Radio.Button>
          </Radio.Group>
        </div>
      }
    >
      <Tabs.TabPane tab={<strong>코스피</strong>} key="kospi">
        <div className="market kospi">
          <h4 hidden={true}>코스피 통계</h4>
          <img
            src={`https://ssl.pstatic.net/imgfinance/chart/mobile/candle/${chartScaleMarket}/KOSPI_end.png`}
            alt="KOSPI Chart"
            width="100%"
          />
          <MarketStatProgress marketStat={marketStat?.kospi || null} />
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab={<strong>코스닥</strong>} key="kosdaq">
        <div className="market kosdaq">
          <h4 hidden={true}>코스닥 통계</h4>
          <img
            src={`https://ssl.pstatic.net/imgfinance/chart/mobile/candle/${chartScaleMarket}/KOSDAQ_end.png`}
            alt="KOSDAQ Chart"
            width="100%"
          />
          <MarketStatProgress marketStat={marketStat?.kosdaq || null} />
        </div>
      </Tabs.TabPane>
    </Tabs>
  );
}

export default MarketStatPanel;
