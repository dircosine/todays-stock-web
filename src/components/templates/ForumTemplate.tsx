import React, { useState } from 'react';
import {
  List,
  Tag,
  Divider,
  Card,
  Space,
  Input,
  Button,
  Progress,
  Skeleton,
  Empty,
} from 'antd';
import Radio, { RadioChangeEvent } from 'antd/lib/radio';
import CopyToClipboard from 'react-copy-to-clipboard';

import Emoji from '../Emoji';
import StockInfoDisplayable from '../StockInfoDisplayable';
import SpaceVertical from '../SpaceVertical';

import { StockInfo } from '../../pages/HomePage';

import { Alert } from 'antd';
import { EditOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { ChartScale } from './HomeTemplate';

import './ForumTemplate.scss';
import SpaceHorizontal from '../SpaceHorizontal';
import MyRank from '../MyRank';
import TextArea from 'antd/lib/input/TextArea';

const tagColors = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];

type ForumTemplateProps = {
  stockInfos: StockInfo[];
};

function ForumTemplate({ stockInfos }: ForumTemplateProps) {
  const [chartScaleMarket, setChartScaleMarket] = useState<ChartScale>('day');
  const [commentTags, setCommentTags] = useState([
    stockInfos[0].name,
    stockInfos[1].name,
  ]);

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

  const handleAddTag = (name: string) => {
    if (!commentTags.includes(name)) {
      setCommentTags((p) => [...p, name]);
    }
  };
  const handleTagClose = (tag: string) => {
    setCommentTags((p) => p.filter((t) => t !== tag));
  };

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit!');
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
              <Button type="link" onClick={() => handleAddTag('코스피')}>
                댓글
              </Button>
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
              <Button type="link" onClick={() => handleAddTag('코스닥')}>
                댓글
              </Button>
              <div>
                <img
                  src={`https://ssl.pstatic.net/imgfinance/chart/mobile/candle/${chartScaleMarket}/KOSDAQ_end.png`}
                  alt="KOSDAQ Chart"
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
              onAddTag={handleAddTag}
            />
          </div>
          <SpaceHorizontal />
          <div className="panel comments">
            <h3>댓글</h3>
            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <div className="username-tag">
                <span className="username">
                  <strong>익명</strong>
                </span>
                {commentTags.map((tag, i) => (
                  <Tag
                    key={i}
                    closable
                    color={tagColors[i % 11]}
                    onClose={(e: any) => {
                      e.preventDefault();
                      handleTagClose(tag);
                    }}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
              <TextArea
                placeholder="한 마디씩 남겨주세용"
                autoSize={{ minRows: 2 }}
              />
              <Button className="submit-btn" htmlType="submit" type="primary">
                남기기
              </Button>
            </form>
            <Divider />
            <div className="comment-content">
              <Empty
                description="처음으로 댓글을 남겨보세요!"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForumTemplate;
