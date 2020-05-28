import React from 'react';
import { Space, Button, Divider, Alert } from 'antd';
import { Link } from 'react-router-dom';
import SpaceHorizontal from './SpaceHorizontal';
import SpaceVertical from './SpaceVertical';
import SharePanel from './SharePanel';
import Emoji from './Emoji';
import MyRank from './MyRank';
import { StockInfo, MarketStat, TodaysStat } from '../lib/stock';
import { useQuery } from '@apollo/react-hooks';
import Loader from './Loader';
import MarketStatPanel from './MarketStatPanel';
import TodaysRankTable from './TodaysRankTable';
import _ from 'lodash';
import { DONE_STAGE, CHECK_LOCAL_LOGIN } from '../lib/queries';

interface TournamentDoneStageProps {
  myRank: StockInfo[];
  onReplay: () => void;
}

function TournamentDoneStage({ onReplay, myRank }: TournamentDoneStageProps) {
  const { data, loading } = useQuery(DONE_STAGE);
  const { data: loginData } = useQuery(CHECK_LOCAL_LOGIN);

  const manipulateMarketStat = (marketStatString: string): MarketStat | null => {
    const marketStat = JSON.parse(marketStatString);
    if (!marketStat) {
      return null;
    }
    const sum = (marketStat.kospi.sell + marketStat.kospi.hold + marketStat.kospi.buy) / 100;
    const result = ['kospi', 'kosdaq'].reduce((acc: any, market: string) => {
      Object.assign(acc, {
        [market]: ['sell', 'hold', 'buy'].reduce((acc: any, position: string) => {
          Object.assign(acc, { [position]: Math.round(marketStat[market][position] / sum) });
          return acc;
        }, {}),
      });
      return acc;
    }, {});

    return result;
  };

  const manipulateTodaysStats = (scoresString: string, stockInfoString: string): TodaysStat[] => {
    const scores: { [key: string]: number } | null = JSON.parse(scoresString);
    const stockInfo: StockInfo[] = JSON.parse(stockInfoString);

    if (!scores) {
      const dummyStat: TodaysStat[] = stockInfo.map((info: StockInfo, index: number) => ({
        ...info,
        rank: '-',
        score: '-',
      }));
      return dummyStat;
    }

    const scored = stockInfo.map((info: StockInfo) => ({
      ...info,
      score: scores[info.name],
    }));
    const todaysStat = _.sortBy(scored, 'score')
      .reverse()
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
    return todaysStat;
  };

  if (loading) return <Loader />;

  const { stockInfo, marketStat, scores } = data.getTodaysTournament;

  return (
    <div>
      <div className="done-stage">
        <div className="section-1 two-column">
          <div className="column-1 ">
            <div className="goto-forum panel">
              <h3 hidden={true}>포럼으로</h3>
              <div style={{ textAlign: 'center' }}>
                <p>
                  좋은 투자 종목 찾으셨나요? <br />
                  객장에서 다른 유저들의 의견도 확인해 보세요
                </p>
                <Space>
                  <Button type="default" shape="round" onClick={onReplay}>
                    다시하기
                  </Button>
                  <Button type="primary" shape="round">
                    <Link to="/forum">객장으로 이동</Link>
                  </Button>
                </Space>
              </div>
            </div>
            <SpaceHorizontal />
          </div>
          <SpaceVertical />
          <div className="column-2">
            <SharePanel
              message={
                <p>
                  매일 자정에 새로운 종목이 업데이트 됩니다
                  <br />
                  링크를 저장해 뒀다 <strong>내일도 들러주세요</strong>{' '}
                  <Emoji symbol="😀" size={16} />
                </p>
              }
            />
            <SpaceHorizontal />
          </div>
        </div>
        <Divider />
        <div className="section-2 two-column">
          <div className="column-1">
            {!loginData.isLoggedIn && (
              <>
                <div className="goto-scorebook panel">
                  <Emoji className="star-emoji" symbol="💯" size={24} />
                  <h3>채점 기능 오픈!</h3>
                  <div style={{ textAlign: 'center' }}>
                    <p>
                      방금 완료한 순위 선정 결과를 채점해 드려요. <br />내 선택이 실제로 어떤
                      수익률을 가져올지 확인해 보세요!
                    </p>
                    <Space>
                      <Button type="primary" shape="round">
                        <Link to="/scorebook">채점 신청하기</Link>
                      </Button>
                    </Space>
                  </div>
                </div>
                <SpaceHorizontal />
              </>
            )}
            <div className="rank panel">
              <h3 hidden={true}>내가 뽑은 순위</h3>
              <Divider>여기, 직접 선정한 순위를 확인하세요!</Divider>
              <MyRank stockInfos={myRank} hasTagButton={false} />
            </div>
            <SpaceHorizontal />
          </div>
          <SpaceVertical />
          <div className="column-2">
            <div className="panel stats">
              <h2>오늘의 통계</h2>
              {!marketStat && (
                <>
                  <Alert
                    type="info"
                    message={
                      <p style={{ margin: 0 }}>
                        통계 제공을 위한 데이터가 쪼끔 모자랍니다 <Emoji symbol="😥" size={15} />
                        <br /> 주변에 오늘의 링크를 공유해 주세요
                      </p>
                    }
                    showIcon
                  />
                  <SpaceHorizontal />
                </>
              )}
              <div className="statistics-market">
                <h3>시장 향방</h3>
                <MarketStatPanel marketStat={manipulateMarketStat(marketStat)} />
              </div>
              <Divider />
              <div className="todays-rank">
                <h3>개별 종목 순위</h3>
                <TodaysRankTable todaysStat={manipulateTodaysStats(scores, stockInfo)} />
              </div>
              <SpaceHorizontal />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TournamentDoneStage;
