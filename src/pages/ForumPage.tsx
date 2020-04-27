import React, { useEffect, useState } from 'react';
import ForumTemplate from '../components/templates/ForumTemplate';
import { StockInfo, getYYYYMMDD } from './TournamentPage';

import { message } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Axios from 'axios';

export type StockInfoRank = StockInfo & {
  rank: number | undefined;
  winRate: number | undefined;
};

type ForecastStat = {
  sell: number;
  hold: number;
  buy: number;
};
export type MarketStat = {
  kospi: ForecastStat;
  kosdaq: ForecastStat;
};

interface ForumPageProps extends RouteComponentProps {}

function ForumPage({ history }: ForumPageProps) {
  const eventDate = getYYYYMMDD(new Date());
  const [todaysInfos, setTodaysInfos] = useState<StockInfo[]>();

  useEffect(() => {
    const doneDates: string[] = JSON.parse(
      localStorage.getItem('doneDates') || '[]',
    );
    if (!doneDates.includes(eventDate)) {
      message.warning('먼저 오늘의 토너먼트를 완료해 주세요', 5);
      history.push('/');
    } else {
      loadTodaysInfos();
    }
    return () => setTodaysInfos(undefined);
  }, [eventDate, history]);

  const loadTodaysInfos = async () => {
    const { data: todaysInfos }: { data: StockInfo[] } = await Axios.get(
      `https://res-todaysstock.s3.ap-northeast-2.amazonaws.com/20200426_stock_infos.json`,
    );
    if (todaysInfos.length === 32) {
      setTodaysInfos(todaysInfos);
    }
  };

  const myRank: StockInfo[] = JSON.parse(
    localStorage.getItem('myRank') || '[]',
  );

  const todaysRank: StockInfoRank[] | undefined = undefined; // API GET HERE
  const marketStat: MarketStat | undefined = undefined; // API GET HERE

  if (!todaysRank) {
    if (!todaysInfos) {
      return <div>loading...</div>;
    }
    const dummyTodaysRank: StockInfoRank[] = todaysInfos.map((stockInfo) => ({
      ...stockInfo,
      rank: undefined,
      winRate: undefined,
      // rank: index + 1,
      // winRate: 32 - index,
    }));
    return (
      // 통계 부족할 때
      <ForumTemplate
        eventDate={eventDate}
        myRank={myRank}
        todaysRank={dummyTodaysRank}
        marketStat={marketStat}
      />
    );
  } else {
    return (
      // 통계 있을 때
      <ForumTemplate
        eventDate={eventDate}
        myRank={myRank}
        todaysRank={todaysRank}
        marketStat={marketStat}
      />
    );
  }
}

export default withRouter(ForumPage);
