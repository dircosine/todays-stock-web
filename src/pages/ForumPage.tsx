import React, { useEffect, useState } from 'react';
import ForumTemplate from '../components/templates/ForumTemplate';
import { message } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { StockInfo } from '../lib/stock';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Loader from '../components/Loader';

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

  return (
    <ForumTemplate
      eventDate={data.getTodaysTournament.eventDate}
      myRank={myRank}
      comments={data.getAllComments}
    />
  );
}

export default withRouter(ForumPage);
