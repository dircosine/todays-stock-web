import React, { useEffect, useState } from 'react';
import ForumTemplate from '../components/templates/ForumTemplate';
import { message } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { StockInfo } from '../lib/stock';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Loader from '../components/Loader';
import { Helmet } from 'react-helmet';
import { logo } from '../img';

const FORUM_PAGE = gql`
  {
    getTodaysTournament {
      eventDate
      stockInfo
      marketStat
      scores
    }
    getAllComments {
      id
      message
      user {
        id
        name
      }
      tags
      tournament {
        eventDate
      }
      createdAt
    }
  }
`;

interface ForumPageProps extends RouteComponentProps {}

function ForumPage({ history }: ForumPageProps) {
  const { loading, data } = useQuery(FORUM_PAGE);
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
    if (data) {
      const doneDates: string[] = JSON.parse(localStorage.getItem('doneDates') || '[]');
      if (!doneDates.includes(data.getTodaysTournament.eventDate)) {
        setMyRank([]);
      }
    }
  }, [data, history]);

  if (loading || !myRank.length) return <Loader />;

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
        eventDate={data.getTodaysTournament.eventDate}
        myRank={myRank}
        comments={data.getAllComments}
      />
    </div>
  );
}

export default withRouter(ForumPage);
