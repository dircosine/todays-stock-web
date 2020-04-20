import React from 'react';
import TournamentTemplate, {
  Round,
} from '../components/templates/TournamentTemplate';
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

type TournamentPageProps = {};

// TODO: lib 분리
function shuffle(a: StockInfo[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function TournamentPage(props: TournamentPageProps) {
  return <TournamentTemplate stockInfos={shuffle(stockInfos)} />;
}

export default TournamentPage;
