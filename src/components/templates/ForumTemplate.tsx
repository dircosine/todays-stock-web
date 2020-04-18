import React, { useState } from 'react';
import { List, Tag, Divider, Card, Space, Input, Button, Progress } from 'antd';
import Radio, { RadioChangeEvent } from 'antd/lib/radio';
import CopyToClipboard from 'react-copy-to-clipboard';

import Emoji from '../Emoji';
import StockInfoDisplayable from '../StockInfoDisplayable';
import SpaceVertical from '../SpaceVertical';

import { StockInfo } from '../../pages/HomePage';

import { Alert } from 'antd';
import { RightOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { ChartScale } from './HomeTemplate';

import './ForumTemplate.scss';
import SpaceHorizontal from '../SpaceHorizontal';
import MyRank from '../MyRank';

type ForumTemplateProps = {
  stockInfos: StockInfo[];
};

function ForumTemplate({ stockInfos }: ForumTemplateProps) {
  const [chartScaleMarket, setChartScaleMarket] = useState<ChartScale>('day');

  const [copyDone, setCopyDone] = useState(false);
  const [showAllRank, setShowAllRank] = useState(false);

  const handleScaleChange = (e: RadioChangeEvent) => {
    setChartScaleMarket(e.target.value);
  };

  const handleCopy = () => {
    setCopyDone(true);
  };

  const toggleShowAll = () => {
    setShowAllRank(!showAllRank);
  };

  return (
    <div className="ForumTemplate">
      {/* <EventDate date={new Date()} /> */}
      <div className="head">
        <h2>
          <Emoji symbol="🎉" /> 완료!
        </h2>
      </div>
      <Alert type="info" showIcon message={<div>announce here</div>} />
      <div className="content">
        <div className="column-1">
          <div className="panel statistics-market">
            <h3>시장 통계</h3>
            <div className="scale-selector market">
              <Radio.Group
                onChange={handleScaleChange}
                defaultValue={chartScaleMarket}
              >
                <Radio.Button value="day">일봉</Radio.Button>
                <Radio.Button value="week">주봉</Radio.Button>
                <Radio.Button value="month">월봉</Radio.Button>
              </Radio.Group>
            </div>
            <div className="market kospi">
              <h4>코스피</h4>
              <div>
                <img
                  src={`https://ssl.pstatic.net/imgfinance/chart/mobile/candle/${chartScaleMarket}/KOSPI_end.png`}
                  alt="KOSPI Chart"
                  width="100%"
                />
              </div>
              <div className="statistics">
                <Progress
                  strokeWidth={16}
                  percent={50}
                  successPercent={30}
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
            </div>
            <Divider />
            <div className="market kosdaq">
              <h4>코스닥</h4>
              <div>
                <img
                  src={`https://ssl.pstatic.net/imgfinance/chart/mobile/candle/${chartScaleMarket}/KOSDAQ_end.png`}
                  alt="KOSPI Chart"
                  width="100%"
                />
                <div className="statistics">
                  <Progress
                    strokeWidth={16}
                    percent={70}
                    successPercent={20}
                    showInfo={false}
                  />
                  <div className="forecast-label">
                    <span>
                      판다! <strong>20%</strong>
                    </span>
                    <span>
                      홀드! <strong>50%</strong>
                    </span>
                    <span>
                      산다! <strong>30%</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SpaceHorizontal />
          <div className="panel statistics-individual">
            <h3>오늘의 종목 통계</h3>
          </div>
        </div>
        <SpaceVertical />
        <div className="column-2">
          <div className="panel share">
            <h3>공유</h3>
            <div style={{ display: 'flex' }}>
              <Input
                style={{ flex: 1 }}
                value={document.location.href}
                disabled
              />
              <CopyToClipboard
                text={document.location.href}
                onCopy={handleCopy}
              >
                <Button
                  className="copy-btn"
                  type={copyDone ? 'default' : 'primary'}
                  icon={copyDone ? <CheckOutlined /> : <CopyOutlined />}
                >
                  {copyDone ? '' : '복사'}
                </Button>
              </CopyToClipboard>
            </div>
          </div>
          <SpaceHorizontal />
          <div className="panel rank">
            <h3>내가 뽑은 순위</h3>
            <MyRank
              stockInfos={stockInfos}
              showAll={showAllRank}
              toggleShowAll={toggleShowAll}
            />
          </div>
          <SpaceHorizontal />
          <div className="panel discussion ">
            <h3>토론</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForumTemplate;
