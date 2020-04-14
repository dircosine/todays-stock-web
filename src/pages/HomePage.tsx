import React from 'react';
import HomeTemplate from '../components/templates/HomeTemplate';

import stockInfos from '../sample_stock_infos.json';
export type StockInfo = {
  name: string;
  code: string;
  market: string;
  price: string;
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

type HomePageProps = {};

function shuffle(a: StockInfo[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function HomePage(props: HomePageProps) {
  return <HomeTemplate stockInfos={shuffle(stockInfos)} />;
}

export default HomePage;
