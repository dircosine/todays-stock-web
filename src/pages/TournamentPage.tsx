import React, { useEffect, useState } from 'react';
import TournamentTemplate from '../components/templates/TournamentTemplate';
import { shuffle } from '../lib/utils';
import { useQuery } from '@apollo/react-hooks';
import { StockInfo } from '../lib/stock';
import Loader from '../components/Loader';
import { Helmet } from 'react-helmet';
import { logo } from '../img';
import { TOURNAMENT_PAGE } from '../lib/queries';

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
      setIsPlayed(true);
    }
    setLocalLoading(false);
  }, [data]);

  if (apiLoading || localLoading) return <Loader />;

  const url = `https://chartys.netlify.app/`;

  return (
    <div>
      <Helmet>
        <title>오늘의 토너먼트</title>
        <meta name="description" content="하루 5분, 보석같은 투자 종목 찾기. 차트연습장" />}
        <link rel="canonical" href={url} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="오늘의 토너먼트" />
        <meta property="og:description" content="하루 5분, 보석같은 투자 종목 찾기. 차트연습장" />
        <meta property="og:image" content={logo} />}
      </Helmet>
      <TournamentTemplate
        initStage={isPlayed ? 'DONE' : 'GUIDE'}
        stockInfos={myRank || shuffle(JSON.parse(data.getTodaysTournament.stockInfo))}
        eventDate={data.getTodaysTournament.eventDate}
      />
    </div>
  );
}

export default TournamentPage;
