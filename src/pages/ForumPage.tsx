import React, { useEffect } from 'react';
import ForumTemplate from '../components/templates/ForumTemplate';

import { message } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { getYYYYMMDD } from '../lib/utils';
import { StockInfo, TodaysStat, MarketStat } from '../lib/stock';

/**
 * todaysInfos: StockInfo[]     s3에서 받아온 오늘의 종목 정보
 *
 * myRank: StockInfo[]          내가 오늘 고른 종목의 순위 정보
 *
 * todaysStat: TodaysStat[]     오늘의 종목 통계
 * marketStat: MarketStat       오늘의 시장 통계
 */

interface ForumPageProps extends RouteComponentProps {}

const todaysStat: TodaysStat[] | null = null; // API GET HERE
const marketStat: MarketStat | null = null; // API GET HERE

function ForumPage({ history }: ForumPageProps) {
  const eventDate = getYYYYMMDD(new Date());
  const myRank: StockInfo[] = JSON.parse(
    localStorage.getItem('myRank') || '[]',
  );

  useEffect(() => {
    const doneDates: string[] = JSON.parse(
      localStorage.getItem('doneDates') || '[]',
    );
    if (!doneDates.includes(eventDate)) {
      message.warning('먼저 오늘의 토너먼트를 완료해 주세요', 5);
      history.push('/');
    }
  }, [eventDate, history]);

  const createDummyStat = (todaysInfos: StockInfo[]): TodaysStat[] => {
    return todaysInfos.map((stockInfo) => ({
      ...stockInfo,
      rank: undefined,
      winRate: undefined,
      // rank: index + 1,
      // winRate: 32 - index,
    }));
  };

  return (
    <ForumTemplate
      eventDate={eventDate}
      myRank={myRank}
      todaysStat={todaysStat || createDummyStat(myRank)}
      marketStat={marketStat}
    />
  );
}

export default withRouter(ForumPage);
