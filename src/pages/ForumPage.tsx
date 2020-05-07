import React, { useEffect, useState } from 'react';
import ForumTemplate from '../components/templates/ForumTemplate';

import { message } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { StockInfo, TodaysStat, MarketStat } from '../lib/stock';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import _ from 'lodash';
import Loader from '../components/Loader';

/**
 * todaysInfos: StockInfo[]     s3에서 받아온 오늘의 종목 정보
 *
 * myRank: StockInfo[]          내가 오늘 고른 종목의 순위 정보
 *
 * todaysStat: TodaysStat[]     오늘의 종목 통계
 * marketStat: MarketStat       오늘의 시장 통계
 */

const FORUM_PAGE = gql`
  {
    getTodaysTournament {
      eventDate
      stockInfo
      marketStat
      scores
      comments {
        id
        message
        user {
          id
          name
        }
        tags
        createdAt
      }
    }
  }
`;

interface ForumPageProps extends RouteComponentProps {}

function ForumPage({ history }: ForumPageProps) {
  const { loading, data } = useQuery(FORUM_PAGE);
  const [myRank, setMyRank] = useState<StockInfo[]>(JSON.parse(localStorage.getItem('myRank') || '[]'));

  useEffect(() => {
    if (!myRank.length) {
      message.warning('먼저 오늘의 토너먼트를 완료해 주세요', 5);
      history.push('/');
    }
  }, [myRank, history]);

  useEffect(() => {
    if (data) {
      const doneDates: string[] = JSON.parse(localStorage.getItem('doneDates') || '[]');
      if (!doneDates.includes(data.getTodaysTournament.eventDate)) {
        setMyRank([]);
      }
    }
  }, [data, history]);

  const manipulateMarketStat = (): MarketStat | null => {
    const marketStat = JSON.parse(data.getTodaysTournament.marketStat);

    if (!marketStat) {
      return null;
    }

    const sum = (marketStat.kospi.sell + marketStat.kospi.hold + marketStat.kospi.buy) / 100;
    const result = ['kospi', 'kosdaq'].reduce((acc: any, market: string) => {
      Object.assign(acc, {
        [market]: ['sell', 'hold', 'buy'].reduce((acc: any, position: string) => {
          Object.assign(acc, { [position]: Math.round(marketStat[market][position] / sum) });
          return acc;
        }, {}),
      });
      return acc;
    }, {});

    return result;
  };

  const manipulateTodaysStat = (): TodaysStat[] => {
    const scores: { [key: string]: number } | null = JSON.parse(data.getTodaysTournament.scores);

    if (!scores) {
      const dummyStat: TodaysStat[] = myRank.map((info: StockInfo, index: number) => ({
        ...info,
        myRank: index + 1,
        rank: '-',
        score: '-',
      }));
      return dummyStat;
    }

    const scored = myRank.map((info: StockInfo, index: number) => ({
      ...info,
      myRank: index + 1,
      score: scores[info.name],
    }));
    const todaysStat = _.sortBy(scored, 'score')
      .reverse()
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
    return todaysStat;
  };

  if (loading || !myRank.length) return <Loader />;

  return (
    <ForumTemplate
      eventDate={data.getTodaysTournament.eventDate}
      myRank={myRank}
      todaysStat={manipulateTodaysStat()}
      marketStat={manipulateMarketStat()}
      comments={data.getTodaysTournament.comments}
    />
  );
}

export default withRouter(ForumPage);
