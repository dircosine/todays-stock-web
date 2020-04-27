import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Radio, Card, Button, Switch, Space, Tooltip, Divider } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import StockCardSelectable from '../StockCardSelectable';

import './TournamentTemplate.scss';
import { Link } from 'react-router-dom';
import SpaceVertical from '../SpaceVertical';
import MarketInfoDisplayable from '../MarketInfoDisplayable';
import MyRank from '../MyRank';
import SpaceHorizontal from '../SpaceHorizontal';
import SharePanel from '../SharePanel';
import EventDate from '../EventDate';
import Emoji from '../Emoji';
import { StockInfo } from '../../lib/stock';

export enum Round {
  Round32 = 32,
  Round16 = 16,
  Round8 = 8,
  Round4 = 4,
  Round2 = 2,
}
export type Stage = 'GUIDE' | 'ROUND' | 'MARKET' | 'DONE' | 'INTERRUPTED';
export type ChartScale = 'day' | 'week' | 'month';
export type Position = 'left' | 'right';

type Market = 'KOSPI' | 'KOSDAQ';
type Forecast = 'BUY' | 'HOLD' | 'SELL';
type MarketForecast = {
  KOSPI: Forecast;
  KOSDAQ: Forecast;
};

interface TournamentTemplateProps {
  stockInfos: StockInfo[];
  eventDate: string;
  loading: boolean;
}

const START_ROUND = Round.Round32; // 추후 유저 선택으로 변경

function TournamentTemplate({
  stockInfos,
  eventDate,
  loading,
}: TournamentTemplateProps) {
  const [myRank, setMyRank] = useState<StockInfo[]>(stockInfos);
  const [round, setRound] = useState<Round>(START_ROUND);
  const [stage, setStage] = useState<Stage>('GUIDE');

  const [chartScale, setChartScale] = useState<ChartScale>('day');

  const [progress, setProgress] = useState(1);
  const [progressLimit, setProgressLimit] = useState(START_ROUND / 2);
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(START_ROUND / 2);

  const [market, setMarket] = useState<Market>('KOSPI');
  const marketForecast = useRef<MarketForecast>({
    KOSPI: 'HOLD',
    KOSDAQ: 'HOLD',
  });

  const [blind, setBlind] = useState(round === Round.Round32);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  useEffect(() => {
    setMyRank(stockInfos);
  }, [stockInfos]);

  useEffect(() => {
    const doneDates: string[] = JSON.parse(
      localStorage.getItem('doneDates') || '[]',
    );
    if (doneDates.includes(eventDate)) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setMyRank(JSON.parse(localStorage.getItem('myRank') || '[]'));
      marketForecast.current = JSON.parse(
        localStorage.getItem('marketForcast') || '{}',
      );
      setStage('DONE');
    }
  }, [eventDate]);

  const setResult = () => {
    localStorage.setItem('myRank', JSON.stringify(myRank));
    localStorage.setItem(
      'marketForecast',
      JSON.stringify(marketForecast.current),
    );
    const doneDates: string[] = JSON.parse(
      localStorage.getItem('doneDates') || '[]',
    );
    localStorage.setItem(
      'doneDates',
      JSON.stringify([...doneDates, eventDate]),
    );
  };

  const goNextRound = (): void => {
    setRound((prevRound) => {
      switch (prevRound) {
        case Round.Round32:
          setBlind(false);
          return Round.Round16;
        case Round.Round16:
          return Round.Round8;
        case Round.Round8:
          return Round.Round4;
        case Round.Round4:
          return Round.Round2;
        case Round.Round2:
          goNextStage();
          return Round.Round32;
      }
    });
  };

  const goNextStage = (): void => {
    setStage((prevStage) => {
      switch (prevStage) {
        case 'GUIDE':
          return 'ROUND';
        case 'ROUND':
          return 'MARKET';
        case 'MARKET':
          setResult();
          return 'DONE';
        case 'DONE':
        case 'INTERRUPTED':
          return 'INTERRUPTED';
      }
    });
  };

  const displayStageTitle = (): string | ReactNode => {
    if (stage === 'GUIDE') {
      return (
        <>
          <strong>"차트맛집"</strong> 에 오신것을 환영합니다!
        </>
      );
    } else if (stage === 'DONE') {
      return '완료!';
    } else if (stage === 'MARKET') {
      return '시장 예측';
    } else {
      switch (round) {
        case Round.Round32:
        case Round.Round16:
        case Round.Round8:
        case Round.Round4:
          return `${round} 강`;
        case Round.Round2:
          return '결승';
      }
    }
  };

  const swapPosition = () => {
    setMyRank((p) => {
      const temp = p[leftIndex];
      p[leftIndex] = p[rightIndex];
      p[rightIndex] = temp;
      return p;
    });
  };

  const handleScaleChange = (e: RadioChangeEvent) => {
    e.preventDefault();
    setChartScale(e.target.value);
  };

  const handleCardClick = (position: Position) => {
    if (position === 'right') {
      swapPosition();
    }

    setProgress((p) => {
      if (p < progressLimit) {
        setLeftIndex((p) => p + 1);
        setRightIndex((p) => p + 1);
        return p + 1;
      } else {
        setProgressLimit((pl) => {
          if (round !== Round.Round2) {
            setLeftIndex(0);
            setRightIndex(pl / 2);
          }
          goNextRound();
          return pl / 2;
        });
        return 1;
      }
    });
  };

  const handleMarketForecastSelect = (forecast: Forecast) => {
    if (market === 'KOSPI') {
      marketForecast.current = { ...marketForecast.current, KOSPI: forecast };
      setMarket('KOSDAQ');
    } else {
      marketForecast.current = { ...marketForecast.current, KOSDAQ: forecast };
      goNextStage();
    }
  };

  const handleReplay = () => {
    if (
      window.confirm('다시 플레이 하시겠어요? 이번 플레이 기록은 삭제됩니다.')
    ) {
      localStorage.removeItem('myRank');
      localStorage.removeItem('marketForecast');
      const doneDates: string[] = JSON.parse(
        localStorage.getItem('doneDates') || '[]',
      );
      localStorage.setItem(
        'doneDates',
        JSON.stringify(doneDates.filter((d) => d !== eventDate)),
      );
      window.location.reload();
    }
  };

  return (
    <div className="TournamentTemplate">
      <h1 hidden={true}>오늘의 토너먼트</h1>
      <h2 className="page-title">
        <EventDate date={eventDate} />의 토너먼트
      </h2>
      <div className="head">
        <h2 className="stage-title">{displayStageTitle()}</h2>
        {stage === 'ROUND' && round !== Round.Round2 && (
          <p>
            <strong>{progress}</strong> / {progressLimit}
          </p>
        )}
      </div>

      <p className="announce">
        {stage === 'GUIDE' && (
          <>
            하루 5분, 보석같은 투자 종목 찾기 <Emoji symbol="💎" />
          </>
        )}
        {stage === 'ROUND' && '향후 전망이 더 좋아보이는 종목을 선택해 주세요!'}
        {stage === 'MARKET' &&
          '마지막으로, 시장 지수 향방에 대해 선택해 주세요!'}
      </p>

      <div className={`control ${stage === 'MARKET' ? 'market-stage' : ''}`}>
        {stage === 'ROUND' && (
          <div className="switch">
            <Tooltip
              className="blind"
              placement="left"
              title="종목 정보는 16강부터 제공됩니다"
              defaultVisible={true}
              visible={round === Round.Round32}
            >
              <Space>
                <span>블라인드</span>
                <Switch
                  checked={blind}
                  onChange={() => setBlind((p) => !p)}
                  disabled={round === Round.Round32}
                />
              </Space>
            </Tooltip>
            <Space className="more-info">
              <span>추가정보</span>
              <Switch
                checked={showMoreInfo}
                onChange={() => setShowMoreInfo((p) => !p)}
                disabled={round === Round.Round32}
              />
            </Space>
          </div>
        )}

        {(stage === 'ROUND' || stage === 'MARKET') && (
          <div className="scale-selector">
            <Space>
              <Radio.Group
                onChange={handleScaleChange}
                defaultValue={chartScale}
              >
                <Radio.Button value="day">일봉</Radio.Button>
                <Radio.Button value="week">주봉</Radio.Button>
                <Radio.Button value="month">월봉</Radio.Button>
              </Radio.Group>
            </Space>
          </div>
        )}
      </div>

      {stage === 'GUIDE' && (
        <div className="guide-stage">
          <Card title={'어떻게 하나요?'}>
            <ul className="guide" style={{ textAlign: 'center' }}>
              <li>
                <Emoji symbol="✨" />
                <p>
                  <strong>매일 32개의 새로운 종목</strong>이 준비됩니다
                </p>
              </li>
              <li>
                <Emoji symbol="🤔" />
                <p>
                  동시에 표시되는 두 종목 중,
                  <br />
                  향후 전망이 더 좋아보이는 쪽을 선택해 주세요
                </p>
              </li>
              <li>
                <Emoji symbol="🏅" />
                <p>
                  토너먼트를 진행하며 최고의 종목을 선정해 주세요!
                  <br />
                  <span className="small">32강 - 16강 - 8강 - 4강 - 결승</span>
                </p>
              </li>
              <li>
                <Emoji symbol="💡" />
                <p>
                  다 끝나면 <strong>"오늘의 포럼"</strong>
                  에서 투자 아이디어를 얻어 가세요!
                </p>
              </li>
              <li>
                <Emoji symbol="👀" />
                <p>
                  <strong>내일도 쓱 한 번 들러주세요!</strong>
                  <br />
                  <span className="small"> (오후 6시 종목 업데이트)</span>
                </p>
              </li>
            </ul>
            <Divider type="horizontal" />
            <Button
              style={{ width: 200 }}
              shape="round"
              type="primary"
              onClick={() => goNextStage()}
              loading={loading}
              disabled={loading}
            >
              시작
            </Button>
          </Card>
        </div>
      )}

      {stage === 'ROUND' && (
        <div className="round-stage">
          <StockCardSelectable
            stockInfo={myRank[leftIndex]}
            chartScale={chartScale}
            position="left"
            blind={blind}
            showMoreInfo={showMoreInfo}
            onClick={handleCardClick}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 24,
              width: 30,
            }}
          >
            vs
          </div>
          {/* <SpaceVertical /> */}
          <StockCardSelectable
            stockInfo={myRank[rightIndex]}
            chartScale={chartScale}
            position="right"
            blind={blind}
            showMoreInfo={showMoreInfo}
            onClick={handleCardClick}
          />
        </div>
      )}

      {stage === 'MARKET' && (
        <div className="market-stage">
          <Card
            bodyStyle={{ paddingRight: 8, paddingLeft: 8 }}
            actions={[
              <Button
                type="link"
                style={{ width: '100%' }}
                shape="round"
                onClick={() => handleMarketForecastSelect('SELL')}
              >
                판다!
              </Button>,
              <Button
                type="link"
                style={{ width: '100%' }}
                shape="round"
                onClick={() => handleMarketForecastSelect('HOLD')}
              >
                홀드
              </Button>,
              <Button
                type="link"
                style={{ width: '100%' }}
                shape="round"
                onClick={() => handleMarketForecastSelect('BUY')}
              >
                산다!
              </Button>,
            ]}
            // hoverable
          >
            <MarketInfoDisplayable market={market} chartScale={chartScale} />
          </Card>
        </div>
      )}

      {stage === 'DONE' && (
        <div className="done-stage">
          <div className="two-column">
            <div className="column-1 ">
              <SharePanel
                message={
                  <p>
                    괜찮은 종목 찾으셨나요? <br />
                    아래 링크를 복사해서 주변에 공유하거나, 저장해 뒀다 내일도
                    들러주세요 <Emoji symbol="😀" size={16} />
                  </p>
                }
              />
            </div>
            <SpaceVertical />
            <div className="column-2">
              <div className="goto-forum panel">
                <h3 hidden={true}>포럼으로</h3>
                <div style={{ textAlign: 'center' }}>
                  <p>오늘의 통계와 다른 유저들의 의견을 확인해 보세요</p>
                  <Space>
                    <Button type="default" shape="round" onClick={handleReplay}>
                      다시하기
                    </Button>
                    <Button type="primary" shape="round">
                      <Link to="/forum">포럼으로 이동</Link>
                    </Button>
                  </Space>
                </div>
              </div>
            </div>
          </div>
          <SpaceHorizontal />
          <Divider>여기, 직접 선택한 결과를 확인하세요!</Divider>
          <div className="two-column">
            <div className="column-1 ">
              <div className="rank panel">
                <h3 hidden={true}>내가 뽑은 순위</h3>
                <MyRank
                  stockInfos={myRank}
                  showAll={true}
                  partialDisplay="high"
                />
              </div>
            </div>
            <SpaceVertical />
            <div className="column-2">
              <div className="rank panel">
                <h3 hidden={true}>내가 뽑은 순위</h3>
                <MyRank
                  stockInfos={myRank}
                  showAll={true}
                  partialDisplay="low"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TournamentTemplate;
