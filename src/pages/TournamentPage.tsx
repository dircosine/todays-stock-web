import React from 'react';
import TournamentTemplate from '../components/templates/TournamentTemplate';
import { getYYYYMMDD, shuffle } from '../lib/utils';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { StockInfo } from '../lib/stock';

interface TournamentPageProps {}

const STOCK_INFO = gql`
  {
    stockInfo(eventDate: "20200430")
  }
`;

function TournamentPage(props: TournamentPageProps) {
  const eventDate = getYYYYMMDD(new Date());
  const { loading, error, data } = useQuery(STOCK_INFO);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>error</p>;

  const stockInfo: StockInfo[] = JSON.parse(data.stockInfo);
  const infoShuffled = shuffle(stockInfo);

  return (
    <TournamentTemplate
      stockInfos={infoShuffled}
      eventDate={eventDate}
      loading={loading}
    />
  );
}

export default TournamentPage;
