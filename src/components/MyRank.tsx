import React, { useState } from 'react';
import { StockInfo } from '../pages/HomePage';
import { List, Card, Space, Tag, Divider, Button } from 'antd';

import { RightOutlined } from '@ant-design/icons';
import StockInfoDisplayable from './StockInfoDisplayable';
import Emoji from './Emoji';

type MyRankProps = {
  stockInfos: StockInfo[];
  showAll: boolean;
  toggleShowAll: () => void;
};

function MyRank({ stockInfos, showAll, toggleShowAll }: MyRankProps) {
  const [infoOpenCodes, setInfoOpenCodes] = useState<string[]>([]);

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

  const handleShowAll = () => {
    toggleShowAll();
  };

  const showAllBtn = (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 50,
      }}
    >
      <Button onClick={handleShowAll}>
        {showAll ? '목록 닫기' : '전체 보기'}
      </Button>
    </div>
  );

  return (
    <div className="MyRank">
      <List
        size="large"
        dataSource={showAll ? stockInfos.slice(0, 8) : stockInfos.slice(0, 4)}
        loadMore={!showAll && showAllBtn}
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
      {showAll && (
        <>
          <Divider dashed={true}>16강 탈락! 그래도 이름은 알렸다..</Divider>
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
            loadMore={showAll && showAllBtn}
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
        </>
      )}
    </div>
  );
}

export default MyRank;
