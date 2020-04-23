import React, { useState } from 'react';
import { Radio, Card, Button, Switch, Space, Tooltip, Divider } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import StockCardSelectable from '../StockCardSelectable';

import { StockInfo } from '../../pages/TournamentPage';

import './TournamentTemplate.scss';
import { Link } from 'react-router-dom';
import SpaceVertical from '../SpaceVertical';
import MarketInfoDisplayable from '../MarketInfoDisplayable';
import MyRank from '../MyRank';
import SpaceHorizontal from '../SpaceHorizontal';
import SharePanel from '../SharePanel';
import EventDate from '../EventDate';
import Emoji from '../Emoji';

export enum Round {
  Round32 = 32,
  Round16 = 16,
  Round8 = 8,
  Round4 = 4,
  Round2 = 2,
  RoundMarket = 1,
  Done = 0,
  Interrupt = -1,
}

// type Round = '32' | '16' | '8' | '4' | '2';
export type ChartScale = 'day' | 'week' | 'month';
export type Position = 'left' | 'right';

type Market = 'KOSPI' | 'KOSDAQ';
type Forecast = 'BUY' | 'HOLD' | 'SELL';
type MarketForecast = {
  KOSPI: Forecast;
  KOSDAQ: Forecast;
};

type TournamentTemplateProps = {
  stockInfos: StockInfo[];
};

const startRound = Round.Done; // 유저 선택으로 변경

function TournamentTemplate({ stockInfos }: TournamentTemplateProps) {
  const [chartScale, setChartScale] = useState<ChartScale>('day');
  const [round, setRound] = useState<Round>(startRound);
  const [progress, setProgress] = useState(1);
  const [progressLimit, setProgressLimit] = useState(startRound / 2);
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(startRound / 2);

  const [market, setMarket] = useState<Market>('KOSPI');
  const [marketForecast, setMarketForecast] = useState<MarketForecast>({
    KOSPI: 'HOLD',
    KOSDAQ: 'HOLD',
  });

  const [blind, setBlind] = useState(round === Round.Round32);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const setResult = () => {
    localStorage.setItem('myRank', JSON.stringify(stockInfos));
    localStorage.setItem('marketForecast', JSON.stringify(marketForecast));
  };

  const setNextRound = (): void => {
    setRound((p) => {
      switch (p) {
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
          return Round.RoundMarket;
        case Round.RoundMarket:
          setResult();
          return Round.Done;
        default:
          return Round.Interrupt;
      }
    });
  };

  const displayRound = (): string => {
    switch (round) {
      case Round.Round32:
      case Round.Round16:
      case Round.Round8:
      case Round.Round4:
        return `${round} 강`;
      case Round.Round2:
        return '결승';
      case Round.RoundMarket:
        return '시장 예측';
      case Round.Done:
        return '완료!';
      default:
        return '중단';
    }
  };

  const swapPosition = () => {
    const temp = stockInfos[leftIndex];
    stockInfos[leftIndex] = stockInfos[rightIndex];
    stockInfos[rightIndex] = temp;
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
          setNextRound();
          return pl / 2;
        });
        return 1;
      }
    });
  };

  const handleMarketForecastSelect = (forecast: Forecast) => {
    if (market === 'KOSPI') {
      setMarketForecast((p) => ({ ...p, KOSPI: forecast }));
      setMarket('KOSDAQ');
    } else {
      setMarketForecast((p) => ({ ...p, KOSDAQ: forecast }));
      setNextRound();
    }
  };

  const handleReplay = () => {
    if (
      window.confirm('다시 플레이 하시겠어요? 이번 플레이 기록은 삭제됩니다.')
    ) {
      localStorage.removeItem('myRank');
      localStorage.removeItem('marketForecast');
      window.location.reload();
    }
  };

  return (
    <div className="TournamentTemplate">
      <h1>
        <EventDate date={new Date()} />의 토너먼트
      </h1>
      <div className="head">
        <h2>{displayRound()}</h2>
        {round !== Round.Round2 &&
          round !== Round.RoundMarket &&
          round !== Round.Done && (
            <p>
              <strong>{progress}</strong> / {progressLimit}
            </p>
          )}
      </div>

      <p className="announce">
        {round !== Round.Done &&
          round !== Round.RoundMarket &&
          '향후 전망이 더 좋아보이는 종목을 선택해 주세요!'}
        {round === Round.RoundMarket &&
          '마지막으로, 시장 지수 향방에 대해 선택해 주세요!'}
      </p>

      <div
        className={`control ${
          round === Round.RoundMarket ? 'market-stage' : ''
        }`}
      >
        {round !== Round.Done && round !== Round.RoundMarket && (
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
        {round !== Round.Done && (
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

      {round !== Round.Done && round !== Round.RoundMarket && (
        <div className="card-wrap">
          <StockCardSelectable
            stockInfo={stockInfos[leftIndex]}
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
            stockInfo={stockInfos[rightIndex]}
            chartScale={chartScale}
            position="right"
            blind={blind}
            showMoreInfo={showMoreInfo}
            onClick={handleCardClick}
          />
        </div>
      )}

      {round === Round.RoundMarket && (
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

      {round === Round.Done && (
        <div className="done-stage">
          <div className="two-column">
            <div className="column-1 ">
              <SharePanel />
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
                  stockInfos={stockInfos}
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
                  stockInfos={stockInfos}
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
