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

    return {
      myRank: targetResult.rank.indexOf(before.name),
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

  return (
    <div className="ScorebookTemplate">
      <div className="head">
        <h2 className="stage-title">{eventDate2Displayable(targetDate)} 채점</h2>
      </div>
      <SpaceHorizontal />
      <div className="two-column">
        <div className="column-1">
          <div className="panel myRank">
            <h3>채점 결과</h3>
            <ScoreTable changeInfos={sortedChangeInfos} />
          </div>
          <SpaceHorizontal />
        </div>
        <SpaceVertical />
        <div className="column-2"></div>
      </div>
    </div>
  );
}

export default ScorebookDetailTemplate;
