import React, { useState } from 'react';
import { Tag, Divider, Input, Button, Progress, Empty, Tabs } from 'antd';
import Radio, { RadioChangeEvent } from 'antd/lib/radio';
import CopyToClipboard from 'react-copy-to-clipboard';

import Emoji from '../Emoji';
import SpaceVertical from '../SpaceVertical';

import { StockInfo } from '../../pages/TournamentPage';

import { Alert } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { ChartScale } from './TournamentTemplate';

import './ForumTemplate.scss';
import SpaceHorizontal from '../SpaceHorizontal';
import MyRank from '../MyRank';
import TextArea from 'antd/lib/input/TextArea';
import SharePanel from '../SharePanel';

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
  const [marketTabSelected, setMarketTabSelected] = useState('코스피');
  const [commentTags, setCommentTags] = useState([
    stockInfos[0].name,
    stockInfos[1].name,
  ]);

  const [showAllRank, setShowAllRank] = useState(false);

  const handleScaleChange = (e: RadioChangeEvent) => {
    e.preventDefault();
    setChartScaleMarket(e.target.value);
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
      <div className="two-column content">
        <div className="column-1">
          <div className="panel statistics-market">
            <h3>시장 통계</h3>
            <Tabs
              defaultActiveKey="코스피"
              onChange={(activeKey: string) => setMarketTabSelected(activeKey)}
              tabBarExtraContent={
                <div style={{ textAlign: 'end' }}>
                  <Button
                    type="link"
                    onClick={() => handleAddTag(marketTabSelected)}
                  >
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
              </Tabs.TabPane>
            </Tabs>
          </div>
          <SpaceHorizontal />
          <div className="panel statistics-individual">
            <h3>오늘의 종목 통계</h3>
          </div>
        </div>
        <SpaceVertical />
        <div className="column-2">
          <SharePanel />
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
