import React, { useState, useEffect } from 'react';
import { TournamentReuslt } from '../../lib/stock';
import Emoji from '../Emoji';
import SpaceHorizontal from '../SpaceHorizontal';
import SpaceVertical from '../SpaceVertical';
import useS3Download from '../../hooks/useS3Download';
import Loader from '../Loader';
import { calcAfterDate, eventDate2Displayable } from '../../lib/utils';
import ScoreTable from '../ScoreTable';
import _ from 'lodash';
import {
  Card,
  Statistic,
  Row,
  Col,
  Button,
  Dropdown,
  Menu,
  PageHeader,
  Breadcrumb,
  Divider,
  Slider,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './ScorebookDetailTemplate.scss';

export type ChangeInfo = {
  myRank: number;
  name: string;
  code: string;
  market: string;
  beforeChartSrc: string;
  afterChartSrc: string;
  beforePrice: string;
  afterPrice: string;
  change: number;
  changePercent: number;
};

interface ScorebookDetailTemplateProps {
  targetDate: string;
  targetResult: TournamentReuslt;
}

function ScorebookDetailTemplate({ targetDate, targetResult }: ScorebookDetailTemplateProps) {
  const [afterString, setAfter] = useState('after1');
  const [afterDate, setAfterDate] = useState(calcAfterDate(targetDate, afterString));
  const { data: beforeInfos } = useS3Download(
    `https://res-todaysstock-dev.s3.ap-northeast-2.amazonaws.com/${targetDate}/today/${targetDate}_stock_infos.json`,
  );
  const { data: afterInfos } = useS3Download(
    `https://res-todaysstock-dev.s3.ap-northeast-2.amazonaws.com/${targetDate}/${afterString}/${calcAfterDate(
      targetDate,
      afterString,
    )}_stock_infos.json`,
  );

  const [averageNum, setAverageNum] = useState(4);

  useEffect(() => {
    setAfterDate(calcAfterDate(targetDate, afterString));
  }, [afterString, targetDate]);

  if (!beforeInfos || !afterInfos) return <Loader />;

  const changeInfos: ChangeInfo[] = beforeInfos.map((before, index) => {
    const after = afterInfos[index];
    const beforePrice = parseInt(before.price.today.split(',').join(''));
    const afterPrice = parseInt(after.price.today.split(',').join(''));
    const change = afterPrice - beforePrice;
    const changePercent = Number(((change / beforePrice) * 100).toFixed(2));
    const rankIndex = targetResult.rank.indexOf(before.name);

    // 0, 1 / 2 / 3 4 / 5 6 7 8
    return {
      // myRank: targetResult.rank.indexOf(before.name),
      myRank:
        rankIndex > 15
          ? 32
          : rankIndex > 7
          ? 16
          : rankIndex > 3
          ? 8
          : rankIndex > 1
          ? 4
          : rankIndex > 0
          ? 2
          : 1,
      name: before.name,
      code: before.code,
      market: before.market,
      beforeChartSrc: `https://res-todaysstock-dev.s3.ap-northeast-2.amazonaws.com/${targetDate}/today/charts/${targetDate}_${before.code}_day.png`,
      afterChartSrc: `https://res-todaysstock-dev.s3.ap-northeast-2.amazonaws.com/${targetDate}/${afterString}/charts/${afterDate}_${before.code}_day.png`,
      beforePrice: before.price.today,
      afterPrice: after.price.today,
      change,
      changePercent,
    };
  });

  const sortedChangeInfos = _.sortBy(changeInfos, 'myRank');

  const periodMenu = (
    <Menu>
      <Menu.Item onClick={() => {}}>1일</Menu.Item>
      <Menu.Item disabled={true} onClick={() => {}}>
        10일
      </Menu.Item>
      <Menu.Item disabled={true} onClick={() => {}}>
        20일
      </Menu.Item>
    </Menu>
  );

  const averageMenu = (
    <Menu>
      <Menu.Item onClick={() => setAverageNum(4)}>상위 4개</Menu.Item>
      <Menu.Item onClick={() => setAverageNum(8)}>상위 8개</Menu.Item>
      <Menu.Item onClick={() => setAverageNum(16)}>상위 16개</Menu.Item>
      <Menu.Item onClick={() => setAverageNum(32)}>전체</Menu.Item>
    </Menu>
  );

  const sliderMarks = {
    4: '4강',
    8: '8강',
    16: '16강',
    32: '전체',
  };

  const average = (num?: number): string => {
    const sum = sortedChangeInfos.slice(0, num || averageNum).reduce((acc, info) => {
      acc += info.changePercent;
      return acc;
    }, 0);
    return (sum / (num || averageNum)).toFixed(2);
  };

  return (
    <div className="ScorebookTemplate">
      <div className="head">
        <h2 className="stage-title">채점 결과</h2>
      </div>
      <SpaceHorizontal />
      <div className="two-column">
        <div className="column-1">
          <div className="panel summary">
            <h3 hidden={true}>채점 요약</h3>
            <div>
              <Row gutter={16}>
                <Col span={9}>
                  <Statistic
                    title="토너먼트 회차"
                    value={eventDate2Displayable(targetDate)}
                    valueStyle={{ fontSize: 20 }}
                  />
                </Col>
                <Col span={9}>
                  <Statistic
                    title="채점 일자"
                    value={eventDate2Displayable(calcAfterDate(targetDate, afterString))}
                    valueStyle={{ fontSize: 20 }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title={
                      <div>
                        <Dropdown overlay={periodMenu}>
                          <Button style={{ padding: 0 }} type="link">
                            기간
                            <DownOutlined />
                          </Button>
                        </Dropdown>
                      </div>
                    }
                    value={1}
                    valueStyle={{ fontSize: 20 }}
                    suffix="일 간"
                  />
                </Col>
              </Row>
              <Divider />
              <Row gutter={16}>
                <Col span={16}>
                  <Statistic
                    title={
                      <div>
                        내 선택{' '}
                        <Dropdown overlay={averageMenu}>
                          <Button style={{ padding: 0 }} type="link">
                            상위 {averageNum}개
                            <DownOutlined />
                          </Button>
                        </Dropdown>{' '}
                        평균
                      </div>
                    }
                    value={average()}
                    valueStyle={{
                      color: `${
                        average() > '0.00' ? 'red' : average() < '0.00' ? 'blue' : 'black'
                      }`,
                    }}
                    precision={2}
                    prefix={average() > '0.00' && '+'}
                    suffix="%"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={<div>회차 평균</div>}
                    value={average(32)}
                    valueStyle={{
                      color: `${
                        average() > '0.00' ? 'red' : average() < '0.00' ? 'blue' : 'black'
                      }`,
                    }}
                    precision={2}
                    prefix={average() > '0.00' && '+'}
                    suffix="%"
                  />
                </Col>
              </Row>
            </div>
          </div>
          <SpaceHorizontal />
        </div>
        <SpaceVertical />
        <div className="column-2">
          <div className="panel all">
            <h3>모든 종목</h3>
            <Slider
              range={false}
              value={averageNum}
              min={1}
              max={32}
              marks={sliderMarks}
              step={null}
              onChange={(value) => setAverageNum(value as number)}
            />
            <ScoreTable changeInfos={sortedChangeInfos.slice(0, averageNum)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScorebookDetailTemplate;
