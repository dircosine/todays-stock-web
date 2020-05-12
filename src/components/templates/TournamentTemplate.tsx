import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Radio, Card, Button, Switch, Space, Tooltip, Carousel } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import StockCardSelectable from '../StockCardSelectable';
import './TournamentTemplate.scss';
import MarketInfoDisplayable from '../MarketInfoDisplayable';
import EventDate from '../EventDate';
import Emoji from '../Emoji';
import { StockInfo } from '../../lib/stock';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import GuideStage from '../GuideStage';
import useMobileLayoutCheck from '../../hooks/useMobileLayoutCheck';
import Timer from '../Timer';
import TournamentDoneStage from '../TournamentDoneStage';

const POST_RESULT = gql`
  mutation postTournamentResult($eventDate: String!, $rank: [String!]!, $market: String!) {
    postTournamentResult(eventDate: $eventDate, rank: $rank, market: $market)
  }
`;

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

type Market = 'kospi' | 'kosdaq';
type Forecast = 'buy' | 'hold' | 'sell';
type MarketForecast = {
  kospi: Forecast;
  kosdaq: Forecast;
};

interface TournamentTemplateProps {
  initStage: Stage;
  stockInfos: StockInfo[];
  eventDate: string;
}

const START_ROUND = Round.Round32; // 추후 유저 선택으로 변경

function TournamentTemplate({ initStage, stockInfos, eventDate }: TournamentTemplateProps) {
  const [myRank, setMyRank] = useState<StockInfo[]>([...stockInfos]);
  const [round, setRound] = useState<Round>(START_ROUND);
  const [stage, setStage] = useState<Stage>(initStage);
  const [dimRef, mobileLayout] = useMobileLayoutCheck();

  const [chartScale, setChartScale] = useState<ChartScale>('day');

  const [progress, setProgress] = useState(1);
  const progressLimit = useRef(START_ROUND / 2);
  const leftIndex = useRef(0);
  const rightIndex = useRef(START_ROUND / 2);

  const [market, setMarket] = useState<Market>('kospi');
  const marketForecast = useRef<MarketForecast>({
    kospi: 'hold',
    kosdaq: 'hold',
  });

  const [blind, setBlind] = useState(round === Round.Round32);
  const [showMoreInfo] = useState(false);

  const [aniMationClassName, setAniMationClassName] = useState('');

  const [postResultMutation] = useMutation(POST_RESULT);

  useEffect(() => {
    setStage(initStage);
    setMyRank(stockInfos);
  }, [initStage, stockInfos]);

  const postResult = async () => {
    const rank = myRank.map((item) => item.name);
    await postResultMutation({
      variables: {
        rank,
        eventDate,
        market: JSON.stringify(marketForecast.current),
      },
    });
  };

  const setResult = () => {
    localStorage.setItem('myRank', JSON.stringify(myRank));
    localStorage.setItem('marketForecast', JSON.stringify(marketForecast.current));
    const doneDates: string[] = JSON.parse(localStorage.getItem('doneDates') || '[]');
    localStorage.setItem('doneDates', JSON.stringify([...doneDates, eventDate]));

    postResult();
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
      window.scrollTo(0, 0);
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
          하루 5분, 보석같은 투자 종목 찾기 <Emoji symbol="💎" />
        </>
      );
    } else if (stage === 'DONE') {
      return (
        <>
          <Emoji symbol="🎉" />
          완료!
        </>
      );
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
      const temp = p[leftIndex.current];
      p[leftIndex.current] = p[rightIndex.current];
      p[rightIndex.current] = temp;
      return p;
    });
  };

  const handleScaleChange = (e: RadioChangeEvent) => {
    e.preventDefault();
    setChartScale(e.target.value);
  };

  const updateLogicState = (position: Position) => {
    if (position === 'right') {
      swapPosition();
    }
    setProgress((p) => {
      if (p < progressLimit.current) {
        leftIndex.current += 1;
        rightIndex.current += 1;
        return p + 1;
      } else {
        leftIndex.current = 0;
        rightIndex.current = progressLimit.current / 2;
        progressLimit.current /= 2;
        goNextRound();
        return 1;
      }
    });
  };

  const handleCardClick = (position: Position) => {
    setAniMationClassName('scale-out');
    // wait for scale-out animation or chart img load
    setTimeout(() => {
      updateLogicState(position);
      setAniMationClassName('fade-in');
    }, 500);
  };

  const handleMarketForecastSelect = (forecast: Forecast) => {
    setAniMationClassName('scale-out');

    setTimeout(() => {
      setAniMationClassName('fade-in');
      if (market === 'kospi') {
        marketForecast.current = { ...marketForecast.current, kospi: forecast };
        setMarket('kosdaq');
      } else {
        marketForecast.current = { ...marketForecast.current, kosdaq: forecast };
        goNextStage();
      }
    }, 500);
  };

  const handleReplay = () => {
    if (window.confirm('다시 플레이 하시겠어요? 이번 플레이 기록은 삭제됩니다.')) {
      localStorage.removeItem('myRank');
      localStorage.removeItem('marketForecast');
      const doneDates: string[] = JSON.parse(localStorage.getItem('doneDates') || '[]');
      localStorage.setItem('doneDates', JSON.stringify(doneDates.filter((d) => d !== eventDate)));
      window.location.reload();
    }
  };

  return (
    <div className="TournamentTemplate" ref={dimRef}>
      <h1 hidden={true}>오늘의 토너먼트</h1>
      <h2 className="page-title" hidden={true}>
        <EventDate date={eventDate} />의 토너먼트
      </h2>
      <div className={`stage-title ${stage === 'ROUND' && 'score-board'}`}>
        {stage === 'ROUND' && (
          <Timer
            initialSec={300}
            onTimeOver={() => {
              console.log('timeover');
            }}
          />
        )}
        <h2 className="round-title">{displayStageTitle()}</h2>
        <p className="progress">
          {stage === 'ROUND' && round !== Round.Round2 && (
            <>
              <strong>{progress}</strong> / {progressLimit.current}
            </>
          )}
        </p>
      </div>
      <p className="announce">
        {stage === 'ROUND' && '향후 전망이 더 좋아보이는 종목을 선택해 주세요!'}
        {stage === 'MARKET' && '마지막으로, 시장 지수 향방에 대해 선택해 주세요!'}
      </p>
      {/* prettier-ignore */}
      <div className={`control ${stage === 'MARKET' ? 'market-stage' : ''}`}
        hidden={stage === 'DONE' || stage === 'GUIDE'}
      >
        {stage === 'ROUND' && (
          <div className="switch">
            <Tooltip
              className="blind"
              placement={'left'}
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
            {/* <Space className="more-info">
              <span>추가정보</span>
              <Switch
                checked={showMoreInfo}
                onChange={() => setShowMoreInfo((p) => !p)}
                disabled={round === Round.Round32}
              />
            </Space> */}
          </div>
        )}

        {(stage === 'ROUND' || stage === 'MARKET') && (
          <div className="scale-selector">
            <Space>
              <Radio.Group onChange={handleScaleChange} defaultValue={chartScale}>
                <Radio.Button value="day">일봉</Radio.Button>
                <Radio.Button value="week">주봉</Radio.Button>
                <Radio.Button value="month">월봉</Radio.Button>
              </Radio.Group>
            </Space>
          </div>
        )}
      </div>

      {stage === 'GUIDE' && <GuideStage goNextStage={goNextStage} />}

      {stage === 'ROUND' && (
        <div className="round-stage">
          {mobileLayout ? (
            <>
              <Carousel className={aniMationClassName}>
                <StockCardSelectable
                  stockInfo={myRank[leftIndex.current]}
                  chartScale={chartScale}
                  position="left"
                  blind={blind}
                  showMoreInfo={showMoreInfo}
                  onClick={handleCardClick}
                  isMobile={true}
                />
                <StockCardSelectable
                  stockInfo={myRank[rightIndex.current]}
                  chartScale={chartScale}
                  position="right"
                  blind={blind}
                  showMoreInfo={showMoreInfo}
                  onClick={handleCardClick}
                  isMobile={true}
                />
              </Carousel>
              <div style={{ textAlign: 'center' }}>
                <Space>
                  <Emoji symbol="👈" />
                  양쪽으로 슬라이드해서 확인
                  <Emoji symbol="👉" />
                </Space>
              </div>
            </>
          ) : (
            <>
              <StockCardSelectable
                className={aniMationClassName}
                stockInfo={myRank[leftIndex.current]}
                chartScale={chartScale}
                position="left"
                blind={blind}
                showMoreInfo={showMoreInfo}
                onClick={handleCardClick}
                isMobile={false}
              />
              <div className="vs">vs</div>
              <StockCardSelectable
                className={aniMationClassName}
                stockInfo={myRank[rightIndex.current]}
                chartScale={chartScale}
                position="right"
                blind={blind}
                showMoreInfo={showMoreInfo}
                onClick={handleCardClick}
                isMobile={false}
              />
            </>
          )}
        </div>
      )}

      {stage === 'MARKET' && (
        <div className="market-stage">
          <Card className={aniMationClassName} bodyStyle={{ paddingRight: 8, paddingLeft: 8 }}>
            <MarketInfoDisplayable market={market} chartScale={chartScale} />
            <div className="buttons">
              <Button
                className="sell"
                size="large"
                shape="round"
                type="primary"
                onClick={() => handleMarketForecastSelect('sell')}
              >
                판다
              </Button>
              <Button
                className="hold"
                size="large"
                shape="round"
                type="primary"
                onClick={() => handleMarketForecastSelect('hold')}
              >
                홀드
              </Button>
              <Button
                className="buy"
                size="large"
                shape="round"
                type="primary"
                onClick={() => handleMarketForecastSelect('buy')}
              >
                산다
              </Button>
            </div>
          </Card>
        </div>
      )}
      {stage === 'DONE' && <TournamentDoneStage myRank={myRank} onReplay={handleReplay} />}
    </div>
  );
}

export default TournamentTemplate;
