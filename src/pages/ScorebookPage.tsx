import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import Loader from '../components/Loader';
import { GET_EVENTDATE, CHECK_LOCAL_LOGIN } from '../lib/queries';
import { message } from 'antd';
import { Helmet } from 'react-helmet';
import { logo } from '../img';
import JoinTemplate from '../components/templates/JoinTemplate';
import ScorebookTemplate from '../components/templates/ScorebookTemplate';

interface ScorebookPageProps extends RouteComponentProps {}

function ScorebookPage({ history }: ScorebookPageProps) {
  const { data: loginData, loading: loginLoading } = useQuery(CHECK_LOCAL_LOGIN);
  const { data, loading } = useQuery(GET_EVENTDATE);

  useEffect(() => {
    if (!data) return;
    const doneDates: string[] = JSON.parse(localStorage.getItem('doneDates') || '[]');
    if (!doneDates.includes(data.getEventDate)) {
      message.warning('먼저 오늘의 토너먼트를 완료해 주세요', 3);
      history.push('/');
    }
  }, [data, history]);

  if (loading || loginLoading) return <Loader />;

  const url = `https://chartys.netlify.app/scorebook`;

  if (!loginData.isLoggedIn) return <JoinTemplate />;
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
      <ScorebookTemplate />
    </div>
  );
}

export default withRouter(ScorebookPage);
