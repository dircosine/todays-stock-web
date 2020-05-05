import React, { useState } from 'react';
import { Tabs, Button, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';

import './MarketStatPanel.scss';
import { MarketStat } from '../lib/stock';
import MarketStatProgress from './MarketStatProgress';

type ChartScale = 'day' | 'week' | 'month';

interface MarketStatPanelProps {
  marketStat: MarketStat | null;
  onAddTag: (name: string) => void;
}

function MarketStatPanel({ marketStat, onAddTag }: MarketStatPanelProps) {
  const [marketTabSelected, setMarketTabSelected] = useState('코스피');
  const [chartScaleMarket, setChartScaleMarket] = useState<ChartScale>('day');

  const handleScaleChange = (e: RadioChangeEvent) => {
    e.preventDefault();
    setChartScaleMarket(e.target.value);
  };

  return (
    <Tabs
      defaultActiveKey="코스피"
      onChange={(activeKey: string) => setMarketTabSelected(activeKey)}
      tabBarExtraContent={
        <div style={{ textAlign: 'end' }}>
          <Button type="link" onClick={() => onAddTag(marketTabSelected)}>
            태그
          </Button>
          <Radio.Group onChange={handleScaleChange} defaultValue={chartScaleMarket}>
            <Radio.Button value="day">일봉</Radio.Button>
            <Radio.Button value="week">주봉</Radio.Button>
            <Radio.Button value="month">월봉</Radio.Button>
          </Radio.Group>
        </div>
      }
    >
      <Tabs.TabPane tab="코스피" key="코스피">
        <div className="market kospi">
          <h4 hidden={true}>코스피 통계</h4>
          <div>
            <img
              src={`https://ssl.pstatic.net/imgfinance/chart/mobile/candle/${chartScaleMarket}/KOSPI_end.png`}
              alt="KOSPI Chart"
              width="100%"
            />
          </div>
          <MarketStatProgress marketStat={marketStat?.kospi || null} />
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab="코스닥" key="코스닥">
        <div className="market kosdaq">
          <h4 hidden={true}>코스닥 통계</h4>
          <div>
            <img
              src={`https://ssl.pstatic.net/imgfinance/chart/mobile/candle/${chartScaleMarket}/KOSDAQ_end.png`}
              alt="KOSDAQ Chart"
              width="100%"
            />
          </div>
          <MarketStatProgress marketStat={marketStat?.kosdaq || null} />
        </div>
      </Tabs.TabPane>
    </Tabs>
  );
}

export default MarketStatPanel;
