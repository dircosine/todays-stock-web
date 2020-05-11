import React, { useState, useEffect } from 'react';
import { Alert, Button, Menu } from 'antd';

import SpaceVertical from '../SpaceVertical';
import './ForumTemplate.scss';
import SpaceHorizontal from '../SpaceHorizontal';
import SharePanel from '../SharePanel';
import TodaysRankTable from '../TodaysRankTable';
import MarketStatPanel from '../MarketStatPanel';
import Emoji from '../Emoji';
import { TodaysStat, MarketStat, StockInfo, Comment } from '../../lib/stock';
import CommentPanel from '../CommentPanel';
import useMobileLayoutCheck from '../../hooks/useMobileLayoutCheck';
import MyRank from '../MyRank';

interface ForumTemplateProps {
  eventDate: string;
  myRank: StockInfo[];
  comments: Comment[];
}

function ForumTemplate({ eventDate, myRank, comments }: ForumTemplateProps) {
  const [commentTags, setCommentTags] = useState<string[]>([myRank[0].name, myRank[1].name]);

  const marketMenu = (
    <Menu>
      <Menu.Item onClick={() => handleAddTag('코스피')}>코스피</Menu.Item>
      <Menu.Item onClick={() => handleAddTag('코스닥')}>코스닥</Menu.Item>
    </Menu>
  );

  const makeTagColorMap = (): { [key: string]: string } => {
    // prettier-ignore
    const tagColors = ['magenta', 'orange', 'purple', 'gold', 
    'lime', 'geekblue', 'volcano', 'cyan', 'green', 'blue', 'red'];

    return myRank.reduce((acc, value, index) => {
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
    <div className="ForumTemplate">
      <h1 hidden={true}>객장</h1>
      <div className="head">
        <h2 className="stage-title">
          <Emoji symbol="💬" />
          객장
        </h2>
      </div>
      <div className="two-column">
        <div className="column-1">
          <SharePanel message="링크를 공유하고 더 많은 의견들을 확인해 보세요!" />
          <SpaceHorizontal />
          <div className="panel myRank">
            <h3>내가 뽑은 순위</h3>
            <MyRank stockInfos={myRank} partialDisplay={'none'} handleAddTag={handleAddTag} />
          </div>
          <SpaceHorizontal />
        </div>
        <SpaceVertical />
        <div className="column-2">
          <CommentPanel
            eventDate={eventDate}
            comments={comments}
            commentTags={commentTags}
            marketMenu={marketMenu}
            tagColorMap={makeTagColorMap()}
            handleTagClose={handleTagClose}
          />
        </div>
      </div>
    </div>
  );
}

export default ForumTemplate;
