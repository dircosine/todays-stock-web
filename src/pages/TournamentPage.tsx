import React, { useEffect, useState } from 'react';
import TournamentTemplate from '../components/templates/TournamentTemplate';

import Axios from 'axios';

export type MoreInfo = {
  cap: string;
  capRank: string;
  amountOfListed: string;
  week52high: string;
  week52low: string;
  per: string;
  pbr: string;
  dividendYield: string;
  industryPer: string;
  industryChange: string;
};

export type PriceInfo = {
  today: string;
  exday: string;
  change: string;
  changePercent: string;
  high: string;
  low: string;
  start: string;
  volume: string;
  tradingValue: string;
};

export type StockInfo = {
  name: string;
  code: string;
  market: string;
  price: PriceInfo;
  more: MoreInfo;
};

type TournamentPageProps = {};

// TODO: lib 분리
function shuffle(a: StockInfo[]): StockInfo[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getYYYYMMDD(d: Date): string {
  const month =
    d.getMonth() < 9 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
  const date = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
  return `${d.getFullYear()}-${month}-${date}`;
}

function TournamentPage(props: TournamentPageProps) {
  const eventDate = getYYYYMMDD(new Date());

  const [todaysInfos, setTodaysInfos] = useState<StockInfo[]>();

  useEffect(() => {
    loadTodaysInfos();
  }, []);

  const loadTodaysInfos = async () => {
    const { data: todaysInfos }: { data: StockInfo[] } = await Axios.get(
      `https://res-todaysstock.s3.ap-northeast-2.amazonaws.com/20200426_stock_infos.json`,
    );
    if (todaysInfos.length === 32) {
      setTodaysInfos(todaysInfos);
    }
  };

  if (!todaysInfos) {
    return <div>loading...</div>;
  }

  return (
    <TournamentTemplate
      stockInfos={shuffle(todaysInfos)}
      eventDate={eventDate}
    />
  );
}

export default TournamentPage;
