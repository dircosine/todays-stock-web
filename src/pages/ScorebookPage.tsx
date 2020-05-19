import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import Loader from '../components/Loader';
import { GET_EVENTDATE } from '../lib/queries';
import { message } from 'antd';
import { Helmet } from 'react-helmet';
import Emoji from '../components/Emoji';
import { logo } from '../img';

interface ScorebookPageProps extends RouteComponentProps {}

function ScorebookPage({ history }: ScorebookPageProps) {
  const { data, loading } = useQuery(GET_EVENTDATE);

  useEffect(() => {
    if (!data) return;
    const doneDates: string[] = JSON.parse(localStorage.getItem('doneDates') || '[]');
    if (!doneDates.includes(data.getEventDate)) {
      message.warning('먼저 오늘의 토너먼트를 완료해 주세요', 3);
      history.push('/');
    }
  }, [data, history]);

  if (loading) return <Loader />;

  const url = `https://chartys.netlify.app/scorebook`;

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
      <div>
        <br />
        <br />
        <br />
        <br />
        <p>오늘 직접 선정한 토너먼트 결과를 가지고,</p>
        <p>
          <strong>향후의 실제 주가 변동에 따른 수익률을 계산해 드립니다! </strong>
        </p>
        <br />
        <p>
          내 차트보는 눈이 어느 정도인지 확인해 보세요 <Emoji symbol="😆" />
        </p>
      </div>
    </div>
  );
}

export default withRouter(ScorebookPage);
