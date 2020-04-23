import React, { useEffect } from 'react';
import ForumTemplate from '../components/templates/ForumTemplate';
import { StockInfo, getYYYYMMDD } from './TournamentPage';

import todaysStock from '../sample_stock_infos.json';
import { message } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router-dom';

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

  useEffect(() => {
    const doneDates: string[] = JSON.parse(
      localStorage.getItem('doneDates') || '[]',
    );
    if (!doneDates.includes(eventDate)) {
      message.warning('먼저 오늘의 토너먼트를 완료해 주세요', 5);
      history.push('/');
    }
  }, [eventDate, history]);

  const myRank: StockInfo[] = JSON.parse(
    localStorage.getItem('myRank') || '[]',
  );

  const todaysRank: StockInfoRank[] | undefined = undefined; // API GET HERE
  const marketStat: MarketStat | undefined = undefined; // API GET HERE

  if (!todaysRank) {
    const dummyTodaysRank: StockInfoRank[] = todaysStock.map((stockInfo) => ({
      ...stockInfo,
      rank: undefined,
      winRate: undefined,
      // rank: index + 1,
      // winRate: 32 - index,
    }));
    return (
      <ForumTemplate
        eventDate={eventDate}
        myRank={myRank}
        todaysRank={dummyTodaysRank}
        marketStat={marketStat}
      />
    );
  } else {
    return (
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
