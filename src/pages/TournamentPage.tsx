import React from 'react';
import TournamentTemplate from '../components/templates/TournamentTemplate';

import { getYYYYMMDD, shuffle } from '../lib/utils';
import useS3Download from '../hooks/useS3Download';

interface TournamentPageProps {}

function TournamentPage(props: TournamentPageProps) {
  const eventDate = getYYYYMMDD(new Date());
  const { data: todaysInfos, loading } = useS3Download(
    'https://res-todaysstock.s3.ap-northeast-2.amazonaws.com/20200426_stock_infos.json',
  );
  const infoShuffled = shuffle(todaysInfos || []);

  return (
    <TournamentTemplate
      stockInfos={infoShuffled}
      eventDate={eventDate}
      loading={loading}
    />
  );
}

export default TournamentPage;
