import React, { useEffect, useState } from 'react';
import TournamentTemplate, { Stage } from '../components/templates/TournamentTemplate';
import { shuffle } from '../lib/utils';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { StockInfo } from '../lib/stock';
import { message } from 'antd';

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
  const { loading, data } = useQuery(TOURNAMENT_PAGE);
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
  }, [data]);

  return (
    <TournamentTemplate
      initStage={isPlayed ? 'DONE' : 'GUIDE'}
      stockInfos={myRank || shuffle(JSON.parse(data?.getTodaysTournament.stockInfo || '[]'))}
      eventDate={data?.getTodaysTournament.eventDate || '20200505'}
      loading={loading}
    />
  );
}

export default TournamentPage;
