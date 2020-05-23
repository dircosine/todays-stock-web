import React, { useEffect, useState } from 'react';
import ForumTemplate from '../components/templates/ForumTemplate';
import { message } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { StockInfo } from '../lib/stock';
import { useQuery } from '@apollo/react-hooks';
import Loader from '../components/Loader';
import { Helmet } from 'react-helmet';
import { logo } from '../img';
import { FORUM_PAGE, GET_EVENTDATE } from '../lib/queries';

interface ForumPageProps extends RouteComponentProps {}

function ForumPage({ history }: ForumPageProps) {
  const { data, loading } = useQuery(FORUM_PAGE);
  const { data: eventDate, loading: eventDateLoading } = useQuery(GET_EVENTDATE);

  const [myRank, setMyRank] = useState<StockInfo[]>(
    JSON.parse(localStorage.getItem('myRank') || '[]'),
  );

  useEffect(() => {
    if (!myRank.length) {
      message.warning('먼저 오늘의 토너먼트를 완료해 주세요', 3);
      history.push('/');
    }
  }, [myRank, history]);

  useEffect(() => {
    if (eventDate) {
      const doneDates: string[] = JSON.parse(localStorage.getItem('doneDates') || '[]');
      if (!doneDates.includes(eventDate.getEventDate)) {
        setMyRank([]);
      }
    }
  }, [eventDate, history]);

  if (loading || eventDateLoading || !myRank.length) return <Loader />;

  const url = `https://chartys.netlify.app/forum`;

  return (
    <div>
      <Helmet>
        <title>객장</title>
        <meta name="description" content="매일 새로운 투자 아이디어 공유. 차트연습장" />}
        <link rel="canonical" href={url} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="객장" />
        <meta property="og:description" content="하루 5분, 보석같은 투자 종목 찾기. 차트연습장" />
        <meta property="og:image" content={logo} />}
      </Helmet>
      <ForumTemplate
        eventDate={eventDate.getEventDate}
        myRank={myRank}
        comments={data.getAllComments}
      />
    </div>
  );
}

export default withRouter(ForumPage);
