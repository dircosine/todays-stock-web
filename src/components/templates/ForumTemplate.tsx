import React, { useState, useEffect } from 'react';
import { Tag, Divider, Button, Empty, Alert, message } from 'antd';

import SpaceVertical from '../SpaceVertical';

import { StockInfo } from '../../pages/TournamentPage';

import './ForumTemplate.scss';
import SpaceHorizontal from '../SpaceHorizontal';
import MyRank from '../MyRank';
import TextArea from 'antd/lib/input/TextArea';
import SharePanel from '../SharePanel';
import EventDate from '../EventDate';
import TodaysRankTable from '../TodaysRankTable';
import { StockInfoRank, MarketStat } from '../../pages/ForumPage';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import MarketStatPanel from '../MarketStatPanel';
import Emoji from '../Emoji';

const tagColors = [
  'magenta',
  'orange',
  'purple',
  'gold',
  'lime',
  'geekblue',
  'volcano',
  'cyan',
  'green',
  'blue',
  'red',
];

interface ForumTemplateProps extends RouteComponentProps {
  myRank: StockInfo[];
  todaysRank: StockInfoRank[];
  marketStat: MarketStat | undefined;
}

function ForumTemplate({
  history,
  myRank,
  todaysRank,
  marketStat,
}: ForumTemplateProps) {
  const [commentTags, setCommentTags] = useState<string[]>([]);

  const [showAllRank, setShowAllRank] = useState(false);

  useEffect(() => {
    if (myRank.length > 2) {
      setCommentTags([myRank[0].name, myRank[1].name]);
    } else {
      message.warning('먼저 오늘의 토너먼트를 완료해 주세요', 5);
      history.push('/');
    }
  }, [history, myRank]);

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
  };

  return (
    <div className="ForumTemplate">
      <h1 hidden={true}>오늘의 포럼</h1>
      <h2>
        <EventDate date={new Date()} />의 포럼
      </h2>
      <div className="head">
        {/* <h2>
          <Emoji symbol="🎉" /> 포럼
        </h2> */}
      </div>
      <div className="two-column content">
        <div className="column-1">
          {!marketStat && (
            <Alert
              type="info"
              message={
                <p style={{ margin: 0 }}>
                  통계 제공을 위한 데이터가 쪼끔 모자랍니다{' '}
                  <Emoji symbol="😥" size={15} />
                  <br /> 주변에 링크를 공유해 주세요
                </p>
              }
              showIcon
            />
          )}
          <SpaceHorizontal />
          <div className="panel statistics-market">
            <h3>시장 통계</h3>
            <MarketStatPanel marketStat={marketStat} onAddTag={handleAddTag} />
          </div>
          <SpaceHorizontal />
          <div className="panel todays-rank">
            <h3>오늘의 종목 통계</h3>
            <TodaysRankTable todaysRank={todaysRank} onAddTag={handleAddTag} />
          </div>
        </div>
        <SpaceVertical />
        <div className="column-2">
          <SharePanel />
          <SpaceHorizontal />
          <div className="panel rank">
            <h3>내가 뽑은 순위</h3>
            <MyRank
              stockInfos={myRank}
              showAll={showAllRank}
              toggleShowAll={toggleShowAll}
            />
          </div>
          <SpaceHorizontal />
          <div className="panel comments">
            <h3>댓글</h3>
            <p>
              원하는 종목 및 시장을{' '}
              <Button style={{ padding: 0 }} type="link">
                태그
              </Button>
              해서 의견을 남길 수 있어요
            </p>
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
                placeholder="여기에 의견을 남겨주세요"
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

export default withRouter(ForumTemplate);
