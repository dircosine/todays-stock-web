import React from 'react';
import ForumTemplate from '../components/templates/ForumTemplate';
import { StockInfo } from './TournamentPage';

import todaysStock from '../sample_stock_infos.json';

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

interface ForumPageProps {}

function ForumPage(props: ForumPageProps) {
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
        myRank={myRank}
        todaysRank={dummyTodaysRank}
        marketStat={marketStat}
      />
    );
  } else {
    return (
      <ForumTemplate
        myRank={myRank}
        todaysRank={todaysRank}
        marketStat={marketStat}
      />
    );
  }
}

export default ForumPage;
