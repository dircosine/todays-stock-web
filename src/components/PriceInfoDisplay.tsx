import React from 'react';
import { Divider, Space } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

import './PriceInfoDisplay.scss';
import { PriceInfo } from '../lib/stock';

interface PriceInfoDisplayProps {
  price: PriceInfo;
}

type Color = 'red' | 'blue' | 'black';

function PriceInfoDisplay({ price }: PriceInfoDisplayProps) {
  const color: Color = price.change.slice(0, 1) === '-' ? 'blue' : price.change.slice(1) === '0' ? 'black' : 'red';

  const caretIcon =
    price.change.slice(0, 1) === '-' ? (
      <CaretDownOutlined />
    ) : price.change.slice(1) === '0' ? (
      '-'
    ) : (
      <CaretUpOutlined />
    );

  return (
    <div className="PriceInfoDisplay">
      <h4>현재가</h4>
      <Space className="main">
        <strong className={color}>
          <em className="today">{price.today}</em>
        </strong>
        <span>
          전일대비 {caretIcon}
          <strong className={color}>{price.change.slice(1)}</strong>
          <Divider type="vertical" />
          <strong className={color}>{price.changePercent}</strong> %
        </span>
      </Space>
      <div className="extra">
        <div>
          <Space className="row-1">
            <Space>
              전일<strong>{price.exday}</strong>
              <Divider type="vertical" />
              시가<strong>{price.start}</strong>
            </Space>
            <Divider type="vertical" />
            <Space>
              고가<strong>{price.high}</strong>
              <Divider type="vertical" />
              저가<strong>{price.low}</strong>
            </Space>
          </Space>
        </div>
        <div className="row-2">
          <Space>
            거래량<strong>{price.volume}</strong>
            <Divider type="vertical" />
            거래대금<strong>{price.tradingValue}</strong>백만
          </Space>
        </div>
      </div>
    </div>
  );
}

export default PriceInfoDisplay;
