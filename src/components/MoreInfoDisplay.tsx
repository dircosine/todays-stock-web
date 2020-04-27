import React from 'react';
import { Space, Divider } from 'antd';
import { MoreInfo } from '../lib/stock';

interface MoreInfoDisplayProps {
  moreInfo: MoreInfo;
  market: string;
}

function MoreInfoDisplay({ moreInfo, market }: MoreInfoDisplayProps) {
  return (
    <div className="info-more">
      <h4>추가정보</h4>
      <ul>
        <li>
          <Space>
            시가총액
            <strong>{moreInfo.cap}</strong>억원 / {market}
            <strong>{moreInfo.capRank}</strong>위
          </Space>
        </li>
        <li>
          <Space>
            상장주식수
            <strong>{moreInfo.amountOfListed}</strong>
          </Space>
        </li>
        <li>
          <Space>
            52주 최고 <strong>{moreInfo.week52high}</strong> / 최저
            <strong>{moreInfo.week52low}</strong>
          </Space>
        </li>
        <li>
          <Space>
            PER
            <strong>{moreInfo.per}</strong>
            (업종평균 {moreInfo.industryPer})
            <Divider type="vertical" />
            PBR
            <strong>{moreInfo.pbr}</strong>
          </Space>
        </li>
      </ul>
    </div>
  );
}

export default MoreInfoDisplay;
