import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'antd';

import SpaceVertical from '../SpaceVertical';
import './ForumTemplate.scss';
import SpaceHorizontal from '../SpaceHorizontal';
import SharePanel from '../SharePanel';
import EventDate from '../EventDate';
import TodaysRankTable from '../TodaysRankTable';
import MarketStatPanel from '../MarketStatPanel';
import Emoji from '../Emoji';
import { TodaysStat, MarketStat, StockInfo, Comment } from '../../lib/stock';
import CommentPanel from '../CommentPanel';
import useMobileLayoutCheck from '../../hooks/useMobileLayoutCheck';

type SplitedPage = 'stats' | 'comments' | 'none';

interface ForumTemplateProps {
  eventDate: string;
  myRank: StockInfo[];
  todaysStat: TodaysStat[];
  marketStat: MarketStat | null;
  comments: Comment[];
}

function ForumTemplate({ eventDate, myRank, todaysStat, marketStat, comments }: ForumTemplateProps) {
  const [commentTags, setCommentTags] = useState<string[]>([myRank[0].name, myRank[1].name]);
  const [dimRef, mobileLayout] = useMobileLayoutCheck();
  const [page, setPage] = useState<SplitedPage>('none');

  useEffect(() => {
    if (mobileLayout) {
      setPage('stats');
    } else {
      setPage('none');
    }
  }, [mobileLayout]);

  const makeTagColorMap = (): { [key: string]: string } => {
    // prettier-ignore
    const tagColors = ['magenta', 'orange', 'purple', 'gold', 
    'lime', 'geekblue', 'volcano', 'cyan', 'green', 'blue', 'red'];

    return todaysStat.reduce((acc, value, index) => {
      Object.assign(acc, { [value.name]: tagColors[index % 11] });
      return acc;
    }, {});
  };

  const handleAddTag = (name: string) => {
    if (!commentTags.includes(name)) {
      setCommentTags((p) => [...p, name]);
    }
  };
  const handleTagClose = (tag: string) => {
    setCommentTags((p) => p.filter((t) => t !== tag));
  };

  return (
    <div className="ForumTemplate" ref={dimRef}>
      <h1 hidden={true}>오늘의 포럼</h1>
      <div className="head">
        <h2 className="stage-title">{page === 'stats' ? '통계' : '객장'}</h2>
      </div>
      {mobileLayout && (
        <Button
          className="float"
          shape="round"
          type="primary"
          onClick={() => {
            setPage((prev) => (prev === 'stats' ? 'comments' : 'stats'));
          }}
        >
          {page === 'stats' ? '객장 >' : '통계 >'}
        </Button>
      )}
      <div className="two-column">
        {page !== 'comments' && (
          <div className="column-1">
            {!marketStat && (
              <>
                <Alert
                  type="info"
                  message={
                    <p style={{ margin: 0 }}>
                      통계 제공을 위한 데이터가 쪼끔 모자랍니다 <Emoji symbol="😥" size={15} />
                      <br /> 주변에 오늘의 링크를 공유해 주세요
                    </p>
                  }
                  showIcon
                />
                <SpaceHorizontal />
              </>
            )}
            <div className="panel statistics-market">
              <h3>오늘의 시장 통계</h3>
              <MarketStatPanel marketStat={marketStat} onAddTag={handleAddTag} />
            </div>
            <SpaceHorizontal />
            <div className="panel todays-rank">
              <h3>오늘의 종목 순위</h3>
              <TodaysRankTable todaysStat={todaysStat} onAddTag={handleAddTag} />
            </div>
            <SpaceHorizontal />
          </div>
        )}
        <SpaceVertical />
        <div className="column-2">
          {page !== 'stats' && (
            <>
              <SharePanel />
              <SpaceHorizontal />
              <CommentPanel
                eventDate={eventDate}
                comments={comments}
                commentTags={commentTags}
                tagColorMap={makeTagColorMap()}
                handleTagClose={handleTagClose}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForumTemplate;
