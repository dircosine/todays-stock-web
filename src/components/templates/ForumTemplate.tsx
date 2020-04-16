import React, { useState } from 'react';
import { List, Tag, Divider, Card, Space, Input, Button } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import CopyToClipboard from 'react-copy-to-clipboard';

import Emoji from '../Emoji';
import StockInfoDisplayable from '../StockInfoDisplayable';
import SpaceVertical from '../SpaceVertical';

import { StockInfo } from '../../pages/HomePage';

import { Alert } from 'antd';
import { RightOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { ChartScale } from './HomeTemplate';

import './ForumTemplate.scss';

type ForumTemplateProps = {
  stockInfos: StockInfo[];
};

function ForumTemplate({ stockInfos }: ForumTemplateProps) {
  const [chartScale, setChartScale] = useState<ChartScale>('day');

  const [infoOpenCodes, setInfoOpenCodes] = useState<string[]>([]);

  const [copyDone, setCopyDone] = useState(false);

  const handleScaleChange = (e: RadioChangeEvent) => {
    setChartScale(e.target.value);
  };

  const toggleInfoOpen = (code: string) => {
    if (infoOpenCodes.includes(code)) {
      setInfoOpenCodes((p) =>
        p.filter((c) => {
          return c !== code;
        }),
      );
    } else {
      setInfoOpenCodes((p) => [code, ...p]);
    }
  };

  const handleCopy = () => {
    setCopyDone(true);
  };

  return (
    <div className="ForumTemplate">
      {/* <EventDate date={new Date()} /> */}
      <div className="head">
        <h2>
          <Emoji symbol="🎉" /> 완료!
        </h2>
      </div>
      <Alert type="info" showIcon message={<div>announce here</div>} />
      <div className="content">
        <div className="share">
          <h3>공유</h3>
          <div style={{ display: 'flex' }}>
            <Input
              style={{ flex: 1 }}
              value={document.location.href}
              disabled
            />
            <CopyToClipboard text={document.location.href} onCopy={handleCopy}>
              <Button
                className="copy-btn"
                type={copyDone ? 'default' : 'primary'}
                icon={copyDone ? <CheckOutlined /> : <CopyOutlined />}
              >
                {copyDone ? '' : '복사'}
              </Button>
            </CopyToClipboard>
          </div>
        </div>
        <SpaceVertical />
        <div className="rank">
          <h3 hidden={true}>랭크</h3>
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
                  onClick={() => toggleInfoOpen(item.code)}
                  hoverable
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      {index === 0 && <Emoji symbol="🥇" />}
                      {index === 1 && <Emoji symbol="🥈" />}
                      {(index === 2 || index === 3) && <Emoji symbol="🥉" />}

                      <Space size={4}>
                        <strong style={{ fontSize: 18 }}>{item.name}</strong>
                        <span>{item.code}</span>
                        <Tag>{item.market}</Tag>
                      </Space>
                    </div>
                    <RightOutlined
                      rotate={infoOpenCodes.includes(item.code) ? 90 : 0}
                    />
                  </div>
                  {infoOpenCodes.includes(item.code) && (
                    <StockInfoDisplayable
                      stockInfo={item}
                      key={item.code}
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
            renderItem={(item) => (
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
                  onClick={() => toggleInfoOpen(item.code)}
                  hoverable
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <Space size={4}>
                        <strong style={{ fontSize: 18 }}>{item.name}</strong>
                        <span>{item.code}</span>
                        <Tag>{item.market}</Tag>
                      </Space>
                    </div>
                    <RightOutlined
                      rotate={infoOpenCodes.includes(item.code) ? 90 : 0}
                    />
                  </div>
                  {infoOpenCodes.includes(item.code) && (
                    <StockInfoDisplayable
                      stockInfo={item}
                      key={item.code}
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
            renderItem={(item) => (
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
                  onClick={() => toggleInfoOpen(item.code)}
                  hoverable
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <Space size={4}>
                        <strong style={{ fontSize: 18 }}>{item.name}</strong>
                        <span>{item.code}</span>
                        <Tag>{item.market}</Tag>
                      </Space>
                    </div>
                    <RightOutlined
                      rotate={infoOpenCodes.includes(item.code) ? 90 : 0}
                    />
                  </div>
                  {infoOpenCodes.includes(item.code) && (
                    <StockInfoDisplayable
                      stockInfo={item}
                      key={item.code}
                      infoExtent={['price', 'chart', 'more']}
                    />
                  )}
                </Card>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default ForumTemplate;
