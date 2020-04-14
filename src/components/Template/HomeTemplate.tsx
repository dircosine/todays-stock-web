import React, { useState } from 'react';
import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';

import EventDate from '../EventDate';
import StockCard from '../StockCard';
import StockCardSelectable from '../StockCardSelectable';
import { StockInfo } from '../../pages/HomePage';

import './HomeTemplate.scss';

enum Round {
  Round32 = '32강',
  Round16 = '16강',
  Round8 = '8강',
  Round4 = '4강',
  Round2 = '결승',
  Done = '완료!',
  Interrupt = '중단',
}
// type Round = '32' | '16' | '8' | '4' | '2';
type ChartScale = 'day' | 'week' | 'month';
export type Position = 'left' | 'right';

type HomeTemplateProps = {
  stockInfos: StockInfo[];
};

function HomeTemplate({ stockInfos }: HomeTemplateProps) {
  const [chartScale, setChartScale] = useState<ChartScale>('day');
  // const [round, setRound] = useState<Round>(Round.Round32);
  const [round, setRound] = useState<Round>(Round.Done);
  const [progress, setProgress] = useState(1);
  const [progressLimit, setProgressLimit] = useState(stockInfos.length / 2);
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(stockInfos.length / 2);

  const setNextRound = () => {
    setRound((p) => {
      switch (p) {
        case Round.Round32:
          return Round.Round16;
        case Round.Round16:
          return Round.Round8;
        case Round.Round8:
          return Round.Round4;
        case Round.Round4:
          return Round.Round2;
        case Round.Round2:
          return Round.Done;
        default:
          return Round.Interrupt;
      }
    });
  };

  const swapPosition = () => {
    const temp = stockInfos[leftIndex];
    stockInfos[leftIndex] = stockInfos[rightIndex];
    stockInfos[rightIndex] = temp;
  };

  const handleScaleChange = (e: RadioChangeEvent) => {
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

  if (round !== Round.Done) {
    return (
      <div className="HomeTemplate">
        <EventDate date={new Date()} />
        <div className="head">
          <h2>{round}</h2>
          {round !== Round.Round2 && (
            <p>
              {progress} / {progressLimit}
            </p>
          )}
        </div>
        <p>32강은 차트만 보고 후딱 추려 보자구용</p>
        <div className="scale-selector">
          <Radio.Group onChange={handleScaleChange} defaultValue={chartScale}>
            <Radio.Button value="day">일봉</Radio.Button>
            <Radio.Button value="week">주봉</Radio.Button>
            <Radio.Button value="month">월봉</Radio.Button>
          </Radio.Group>
        </div>
        <div className="card-wrap">
          <StockCardSelectable
            stockInfo={stockInfos[leftIndex]}
            chartScale={chartScale}
            position="left"
            onClick={handleCardClick}
          />
          <div className="space-column" />
          <StockCardSelectable
            stockInfo={stockInfos[rightIndex]}
            chartScale={chartScale}
            position="right"
            onClick={handleCardClick}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="HomeTemplate">
        <EventDate date={new Date()} />
        <div className="head">
          <h2>{round}</h2>
        </div>

        <div className="rank-display">
          <div className="rank-1-2">
            <StockCard
              className="winner"
              stockInfo={stockInfos[0]}
              showChart={true}
              showInfoType="all"
            />
            <div className="space-column" />
            <StockCard
              className="second"
              stockInfo={stockInfos[1]}
              showChart={true}
              showInfoType="all"
            />
          </div>
          <div className="space-row" />
          <ul className="rank-3-8">
            {stockInfos.slice(2, 4).map((stockInfo) => (
              <li className="item" key={stockInfo.code}>
                <StockCard
                  stockInfo={stockInfo}
                  showChart={true}
                  showInfoType="all"
                />
              </li>
            ))}
            {stockInfos.slice(4, 8).map((stockInfo) => (
              <li className="item" key={stockInfo.code}>
                <StockCard
                  stockInfo={stockInfo}
                  showChart={false}
                  showInfoType="all"
                />
              </li>
            ))}
          </ul>
          <div className="space-row" />
          <ul className="rank-8-16">
            {stockInfos.slice(8, 16).map((stockInfo) => (
              <li className="item" key={stockInfo.code}>
                <StockCard
                  stockInfo={stockInfo}
                  showChart={false}
                  showInfoType="head"
                />
              </li>
            ))}
          </ul>
          <div className="space-row" />
          <ul className="rank-under-16">
            {stockInfos.slice(16).map((stockInfo) => (
              <li className="item" key={stockInfo.code}>
                <StockCard
                  stockInfo={stockInfo}
                  showChart={false}
                  showInfoType="head"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default HomeTemplate;
