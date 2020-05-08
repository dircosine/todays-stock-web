import React, { useEffect, useState } from 'react';
import TournamentTemplate from '../components/templates/TournamentTemplate';
import { shuffle } from '../lib/utils';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { StockInfo } from '../lib/stock';
import { message } from 'antd';
import Loader from '../components/Loader';

export const TOURNAMENT_PAGE = gql`
  {
    getTodaysTournament {
      stockInfo
      eventDate
    }
  }
`;

interface TournamentPageProps {}
function TournamentPage(props: TournamentPageProps) {
  const { loading: apiLoading, data } = useQuery(TOURNAMENT_PAGE);
  const [localLoading, setLocalLoading] = useState(true);
  const [isPlayed, setIsPlayed] = useState(false);
  const [myRank, setMyRank] = useState<StockInfo[] | null>(null);

  useEffect(() => {
    if (!data) return;
    const doneDates: string[] = JSON.parse(localStorage.getItem('doneDates') || '[]');
    if (doneDates.includes(data.getTodaysTournament.eventDate)) {
      setMyRank(JSON.parse(localStorage.getItem('myRank') || '[]'));
      message.success('오늘 토너먼트는 완료했습니다! ', 5);
      setIsPlayed(true);
    }
    setLocalLoading(false);
  }, [data]);

  if (apiLoading || localLoading) return <Loader />;

  return (
    <TournamentTemplate
      initStage={isPlayed ? 'DONE' : 'ROUND'}
      stockInfos={myRank || shuffle(JSON.parse(data.getTodaysTournament.stockInfo))}
      eventDate={data.getTodaysTournament.eventDate}
    />
  );
}

export default TournamentPage;
