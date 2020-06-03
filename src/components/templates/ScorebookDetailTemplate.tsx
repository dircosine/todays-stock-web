import React, { useState, useEffect } from 'react';
import { TournamentReuslt } from '../../lib/stock';
import Emoji from '../Emoji';
import SpaceHorizontal from '../SpaceHorizontal';
import SpaceVertical from '../SpaceVertical';
import useS3Download from '../../hooks/useS3Download';
import Loader from '../Loader';
import { calcAfterDate, eventDate2Displayable, formatEventDate } from '../../lib/utils';
import ScoreTable from '../ScoreTable';
import _ from 'lodash';
import { Statistic, Row, Col, Button, Dropdown, Menu, Divider, Slider, Alert } from 'antd';
import { DownOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './ScorebookDetailTemplate.scss';
import { useHistory } from 'react-router-dom';
import ReactHighcharts from 'react-highcharts';

const S3_BUCKET = process.env.NODE_ENV === 'production' ? 'res-todaysstock' : 'res-todaysstock-dev';

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
  after: string;
}

function ScorebookDetailTemplate({
  targetDate,
  targetResult,
  after,
}: ScorebookDetailTemplateProps) {
  const history = useHistory();
  const [afterString, setAfterString] = useState(`after${after}`);
  const [afterDate, setAfterDate] = useState(calcAfterDate(targetDate, after));
  const { data: beforeInfos } = useS3Download(
    `https://${S3_BUCKET}.s3.ap-northeast-2.amazonaws.com/${targetDate}/today/${targetDate}_stock_infos.json`,
  );
  const { data: afterInfos } = useS3Download(
    `https://${S3_BUCKET}.s3.ap-northeast-2.amazonaws.com/${targetDate}/${afterString}/${afterDate}_stock_infos.json`,
  );

  const [averageNum, setAverageNum] = useState(4);

  useEffect(() => {
    setAfterDate(calcAfterDate(targetDate, after));
    setAfterString(`after${after}`);
  }, [after, targetDate]);

  if (!beforeInfos || !afterInfos) return <Loader />;

  const changeInfos: ChangeInfo[] = beforeInfos.map((before, index) => {
    const after = afterInfos[index];
    const beforePrice = parseInt(before.price.today.split(',').join(''));
    const afterPrice = parseInt(after.price.today.split(',').join(''));
    const change = afterPrice - beforePrice;
    const changePercent = Number(((change / beforePrice) * 100).toFixed(2));
    const rankIndex = targetResult.rank.indexOf(before.name);
    const invalidChange = Math.abs(changePercent) > 30;
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
      beforeChartSrc: `https://${S3_BUCKET}.s3.ap-northeast-2.amazonaws.com/${targetDate}/today/charts/${targetDate}_${before.code}_day.png`,
      afterChartSrc: `https://${S3_BUCKET}.s3.ap-northeast-2.amazonaws.com/${targetDate}/${afterString}/charts/${afterDate}_${before.code}_day.png`,
      beforePrice: before.price.today,
      afterPrice: after.price.today,
      change: invalidChange ? 0 : change,
      changePercent: invalidChange ? 0 : changePercent,
    };
  });

  const sortedChangeInfos = _.sortBy(changeInfos, 'myRank');

  const chartData = sortedChangeInfos.map((info, index) => ({
    name: `${index + 1}.${info.name}`,
    y: info.changePercent,
  }));

  const chartConfig = {
    chart: { type: 'column' },
    title: { text: '' },
    xAxis: {
      type: 'category',
      labels: {
        rotation: -45,
        style: {
          fontSize: '12px',
        },
      },
    },
    yAxis: { title: null },
    legend: { enabled: false },
    plotOptions: {
      series: { borderWidth: 0, dataLabels: { enabled: true, format: '{point.y:.1f}%' } },
    },
    tooltip: {
      headerFormat: '',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b>',
    },
    series: [
      {
        name: 'Stocks',
        colorByPoint: false,
        data: chartData,
        dataLabels: {
          enabled: false,
          rotation: -90,
          color: '#000',
          align: 'center',
          format: '{point.y:.1f}',
          y: 10,
          style: {
            fontSize: '10px',
          },
        },
      },
    ],
  };

  const average = (num?: number): string => {
    const sum = sortedChangeInfos.slice(0, num || averageNum).reduce((acc, info) => {
      acc += info.changePercent;
      return acc;
    }, 0);
    return (sum / (num || averageNum)).toFixed(2);
  };

  const averageAll = average(32);

  const periodMenu = (
    <Menu>
      {[3, 10, 20].map((after) => {
        const afterDate = calcAfterDate(targetDate, after.toString());
        const nowDate = formatEventDate(new Date());
        return (
          <Menu.Item
            key={after}
            onClick={() => {
              window.scrollTo(0, 0);
              history.push(`/scorebook/${targetDate}/${after}`);
            }}
            disabled={afterDate > nowDate}
          >
            {after}일
          </Menu.Item>
        );
      })}
    </Menu>
  );

  // const periodMenu = (
  //   <Menu>
  //     <Menu.Item onClick={() => history.push(`/scorebook/${targetDate}/3`)}>3일</Menu.Item>
  //     <Menu.Item disabled={true} onClick={() => history.push(`/scorebook/${targetDate}/10`)}>
  //       10일
  //     </Menu.Item>
  //     <Menu.Item disabled={true} onClick={() => history.push(`/scorebook/${targetDate}/20`)}>
  //       20일
  //     </Menu.Item>
  //   </Menu>
  // );

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

  return (
    <div className="ScorebookTemplate">
      <div className="sticky">
        <Button
          type="link"
          onClick={() => {
            window.scrollTo(0, 0);
            history.push('/scorebook');
          }}
        >
          <ArrowLeftOutlined />
          목록
        </Button>
      </div>
      <div className="head">
        <h2 className="stage-title">
          <Emoji symbol="💯" />
          채점 결과
        </h2>
      </div>
      <SpaceHorizontal />
      <div className="two-column">
        <div className="column-1">
          {average(32) === '0.00' && (
            <>
              <Alert
                type="warning"
                message={
                  <p style={{ margin: 0 }}>
                    기간 내 개장일이 없을 경우 수익률이 모두 '0%'로 표시됩니다(주말 등){' '}
                    <Emoji symbol="😥" size={15} />
                    <br /> 10일, 20일 경과 후 다시 확인해 보세요!
                  </p>
                }
                showIcon
              />
              <SpaceHorizontal />
            </>
          )}
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
                    value={eventDate2Displayable(afterDate)}
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
                    value={after}
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
                    value={averageAll}
                    valueStyle={{
                      color: `${
                        averageAll > '0.00' ? 'red' : averageAll < '0.00' ? 'blue' : 'black'
                      }`,
                    }}
                    precision={2}
                    prefix={averageAll > '0.00' && '+'}
                    suffix="%"
                  />
                </Col>
              </Row>
            </div>
          </div>
          <SpaceHorizontal />
          <div className="panel chart">
            <h3>내 순위별 수익률 분포</h3>
            <ReactHighcharts config={chartConfig}></ReactHighcharts>
          </div>
          <SpaceHorizontal />
        </div>
        <SpaceVertical />
        <div className="column-2">
          <div className="panel all">
            <h3>종목별 상세</h3>
            <Slider
              range={false}
              value={averageNum}
              min={1}
              max={32}
              marks={sliderMarks}
              step={null}
              onChange={(value) => setAverageNum(value as number)}
            />
            <ScoreTable
              changeInfos={sortedChangeInfos.slice(0, averageNum)}
              targetDate={eventDate2Displayable(targetDate)}
              after={after}
              afterDate={eventDate2Displayable(afterDate)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScorebookDetailTemplate;
