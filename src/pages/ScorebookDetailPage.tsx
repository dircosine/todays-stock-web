import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import Loader from '../components/Loader';
import { GET_TOURNAMENT_RESULTS, GET_EVENTDATE } from '../lib/queries';
import { Helmet } from 'react-helmet';
import { logo } from '../img';
import ScorebookDetailTemplate from '../components/templates/ScorebookDetailTemplate';
import { TournamentReuslt } from '../lib/stock';
import { calcAfterDate, formatEventDate } from '../lib/utils';

interface ScorebookDetailPagePageProps {}

function ScorebookDetailPagePage(props: ScorebookDetailPagePageProps) {
  const history = useHistory();
  const params = useParams<{ targetDate: string; after: string }>();

  useQuery(GET_EVENTDATE);
  const { data, loading } = useQuery(GET_TOURNAMENT_RESULTS, {
    variables: { userEmail: localStorage.getItem('email') },
  });

  if (calcAfterDate(params.targetDate, params.after.toString()) > formatEventDate(new Date()))
    history.push('/scorebook');

  if (loading) return <Loader />;

  const url = `https://chartys.netlify.app/ScorebookDetailPage`;

  const [targetResult] = data.getTournamentResults.filter(
    (e: TournamentReuslt) => e.tournament.eventDate === params.targetDate,
  );

  return (
    <div>
      <Helmet>
        <title>채점</title>
        <meta name="description" content="하루 5분, 보석같은 투자 종목 찾기." />}
        <link rel="canonical" href={url} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="채점" />
        <meta property="og:description" content="하루 5분, 보석같은 투자 종목 찾기." />
        <meta property="og:image" content={logo} />}
      </Helmet>
      <ScorebookDetailTemplate
        targetDate={params.targetDate}
        targetResult={targetResult}
        after={params.after}
      />
    </div>
  );
}

export default ScorebookDetailPagePage;
