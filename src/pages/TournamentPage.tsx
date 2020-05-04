import React from 'react';
import TournamentTemplate from '../components/templates/TournamentTemplate';
import { shuffle } from '../lib/utils';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

interface TournamentPageProps {}

export const TOURNAMENT_PAGE = gql`
  {
    todaysInfo {
      stockInfo
      eventDate
    }
  }
`;

function TournamentPage(props: TournamentPageProps) {
  const { loading, data } = useQuery(TOURNAMENT_PAGE);

  // const rank = todaysInfo.map((i) => i.name);
  // const market = {
  //   kospi: 'sell',
  //   kosdaq: 'buy',
  // };

  // const handlePostResult = async () => {
  //   const res = await postResultMutation({
  //     variables: { tournamentId: 3, rank, market: JSON.stringify(market) },
  //   });
  //   console.log(res);
  // };

  if (loading) return <div>Loading...</div>;

  const stockInfo = JSON.parse(data.todaysInfo.stockInfo);

  return (
    <TournamentTemplate
      stockInfos={shuffle(stockInfo)}
      eventDate={data.todaysInfo.eventDate}
      loading={loading}
    />
  );
}

export default TournamentPage;
