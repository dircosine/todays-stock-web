import React, { useState } from 'react';
import { Radio, List, Tag, Divider, Card } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';

import EventDate from '../EventDate';
import StockCardSelectable from '../StockCardSelectable';
import { StockInfo } from '../../pages/HomePage';

import { RightOutlined } from '@ant-design/icons';

import './HomeTemplate.scss';
import Emoji from '../Emoji';
import StockInfoDisplayable from '../StockInfoDisplayable';

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

  const [infoOpenIndexes, setInfoOpenIndexes] = useState<number[]>([]);

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

  const toggleInfoOpen = (index: number) => {
    if (infoOpenIndexes.includes(index)) {
      setInfoOpenIndexes((p) =>
        p.filter((i) => {
          return i !== index;
        }),
      );
    } else {
      setInfoOpenIndexes((p) => [index, ...p]);
    }
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
        <p className="announce">32강은 차트만 보고 후딱 추려 보자구용</p>
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
          <div className="space-vertical" />
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

        <div className="content">
          <div className="rank" style={{ background: 'white' }}>
            <List
              size="large"
              dataSource={stockInfos.slice(0, 8)}
              renderItem={(item, index) => (
                <List.Item style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <Card
                    bordered={false}
                    style={{
                      background: 'none',
                      width: '100%',
                    }}
                    bodyStyle={{
                      padding: 12,
                    }}
                    onClick={() => toggleInfoOpen(index)}
                    hoverable
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        {index === 0 && <Emoji symbol="🥇" />}
                        {index === 1 && <Emoji symbol="🥈" />}
                        {(index === 2 || index === 3) && <Emoji symbol="🥉" />}

                        <strong style={{ fontSize: 18 }}>{item.name}</strong>
                        <span style={{ margin: '0 4px' }}>{item.code}</span>
                        <Tag>{item.market}</Tag>
                      </div>
                      <RightOutlined
                        rotate={infoOpenIndexes.includes(index) ? 90 : 0}
                      />
                    </div>
                    {infoOpenIndexes.includes(index) && (
                      <StockInfoDisplayable
                        stockInfo={item}
                        key={index}
                        infoExtent={['price', 'chart', 'more']}
                      />
                    )}
                  </Card>
                </List.Item>
              )}
            />
            <Divider dashed={true}> 16강 탈락! 그래도 이름은 알렸다..</Divider>
            <List
              size="large"
              dataSource={stockInfos.slice(8, 16)}
              renderItem={(item, index) => (
                <List.Item style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <Card
                    bordered={false}
                    style={{
                      background: 'none',
                      width: '100%',
                    }}
                    bodyStyle={{
                      padding: 12,
                    }}
                    onClick={() => toggleInfoOpen(index)}
                    hoverable
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: 18 }}>{item.name}</strong>
                        <span style={{ margin: '0 4px' }}>{item.code}</span>
                        <Tag>{item.market}</Tag>
                      </div>
                      <RightOutlined
                        rotate={infoOpenIndexes.includes(index) ? 90 : 0}
                      />
                    </div>
                    {infoOpenIndexes.includes(index) && (
                      <StockInfoDisplayable
                        stockInfo={item}
                        key={index}
                        infoExtent={['price', 'chart', 'more']}
                      />
                    )}
                  </Card>
                </List.Item>
              )}
            />
            <Divider dashed={true}>
              차트만 보고 걸렀지만.. 다시보니 선녀?!
            </Divider>
            <List
              size="large"
              dataSource={stockInfos.slice(16)}
              renderItem={(item, index) => (
                <List.Item style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <Card
                    bordered={false}
                    style={{
                      background: 'none',
                      width: '100%',
                    }}
                    bodyStyle={{
                      padding: 12,
                    }}
                    onClick={() => toggleInfoOpen(index)}
                    hoverable
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: 18 }}>{item.name}</strong>
                        <span style={{ margin: '0 4px' }}>{item.code}</span>
                        <Tag>{item.market}</Tag>
                      </div>
                      <RightOutlined
                        rotate={infoOpenIndexes.includes(index) ? 90 : 0}
                      />
                    </div>
                    {infoOpenIndexes.includes(index) && (
                      <StockInfoDisplayable
                        stockInfo={item}
                        key={index}
                        infoExtent={['price', 'chart', 'more']}
                      />
                    )}
                  </Card>
                </List.Item>
              )}
            />
          </div>
          <div className="space-vertical" />
          <div className="share"></div>
        </div>

        {/* <div className="rank-display">
          <div className="rank-1-2">
            <StockCard
              className="winner"
              stockInfo={stockInfos[0]}
              showChart={true}
              infoExtent="all"
            />
            <div className="space-vertical" />
            <StockCard
              className="second"
              stockInfo={stockInfos[1]}
              showChart={true}
              infoExtent="all"
            />
          </div>
          <div className="space-horizontal" />
          <ul className="rank-3-8">
            {stockInfos.slice(2, 4).map((stockInfo) => (
              <li className="item" key={stockInfo.code}>
                <StockCard
                  stockInfo={stockInfo}
                  showChart={true}
                  infoExtent="all"
                />
              </li>
            ))}
            {stockInfos.slice(4, 8).map((stockInfo) => (
              <li className="item" key={stockInfo.code}>
                <StockCard
                  stockInfo={stockInfo}
                  showChart={false}
                  infoExtent="all"
                />
              </li>
            ))}
          </ul>
          <div className="space-horizontal" />
          <ul className="rank-8-16">
            {stockInfos.slice(8, 16).map((stockInfo) => (
              <li className="item" key={stockInfo.code}>
                <StockCard
                  stockInfo={stockInfo}
                  showChart={false}
                  infoExtent="head"
                />
              </li>
            ))}
          </ul>
          <div className="space-horizontal" />
          <ul className="rank-under-16">
            {stockInfos.slice(16).map((stockInfo) => (
              <li className="item" key={stockInfo.code}>
                <StockCard
                  stockInfo={stockInfo}
                  showChart={false}
                  infoExtent="head"
                />
              </li>
            ))}
          </ul>
        </div> */}
      </div>
    );
  }
}

export default HomeTemplate;
