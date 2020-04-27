import React, { useState } from 'react';
import { Tabs, Button, Radio, Progress } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';

import './MarketStatPanel.scss';
import { MarketStat } from '../lib/stock';

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
          <Radio.Group
            onChange={handleScaleChange}
            defaultValue={chartScaleMarket}
          >
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
          {marketStat ? (
            <div className="statistics">
              <Progress
                strokeWidth={16}
                percent={100 - marketStat.kospi.buy}
                successPercent={marketStat.kospi.sell}
                showInfo={false}
              />
              <div className="forecast-label">
                <span>
                  판다! <strong>30%</strong>
                </span>
                <span>
                  홀드! <strong>20%</strong>
                </span>
                <span>
                  산다! <strong>50%</strong>
                </span>
              </div>
            </div>
          ) : (
            <div className="statistics">
              <Progress
                strokeWidth={16}
                percent={66.7}
                successPercent={33.3}
                showInfo={false}
              />
              <div className="forecast-label">
                <span>
                  판다! <strong>- %</strong>
                </span>
                <span>
                  홀드! <strong>- %</strong>
                </span>
                <span>
                  산다! <strong>- %</strong>
                </span>
              </div>
            </div>
          )}
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
            {marketStat ? (
              <div className="statistics">
                <Progress
                  strokeWidth={16}
                  percent={100 - marketStat.kosdaq.buy}
                  successPercent={marketStat.kosdaq.sell}
                  showInfo={false}
                />
                <div className="forecast-label">
                  <span>
                    판다! <strong>30%</strong>
                  </span>
                  <span>
                    홀드! <strong>20%</strong>
                  </span>
                  <span>
                    산다! <strong>50%</strong>
                  </span>
                </div>
              </div>
            ) : (
              <div className="statistics">
                <Progress
                  strokeWidth={16}
                  percent={66.7}
                  successPercent={33.3}
                  showInfo={false}
                />
                <div className="forecast-label">
                  <span>
                    판다! <strong>- %</strong>
                  </span>
                  <span>
                    홀드! <strong>- %</strong>
                  </span>
                  <span>
                    산다! <strong>- %</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Tabs.TabPane>
    </Tabs>
  );
}

export default MarketStatPanel;
