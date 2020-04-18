import React, { useState } from 'react';
import { List, Tag, Divider, Card, Space, Input, Button } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
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
  const [chartScale, setChartScale] = useState<ChartScale>('day');

  const [copyDone, setCopyDone] = useState(false);
  const [showAllRank, setShowAllRank] = useState(false);

  const handleScaleChange = (e: RadioChangeEvent) => {
    setChartScale(e.target.value);
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
          <div className="statistics-market">
            <h3>마켓 통계</h3>
          </div>
          <SpaceHorizontal />
          <div className="statistics-individual">
            <h3>오늘의 종목 통계</h3>
          </div>
        </div>
        <SpaceVertical />
        <div className="column-2">
          <div className="share">
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
          <div className="rank">
            <h3 hidden={true}>랭크</h3>
            <MyRank
              stockInfos={stockInfos}
              showAll={showAllRank}
              toggleShowAll={toggleShowAll}
            />
          </div>
          <SpaceHorizontal />
          <div className="discussion ">
            <h3>토론</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForumTemplate;
