import React, { useState } from 'react';
import { List, Card, Space, Tag, Divider, Button } from 'antd';

import { RightOutlined } from '@ant-design/icons';
import StockInfoDisplayable from './StockInfoDisplayable';
import Emoji from './Emoji';
import { StockInfo } from '../lib/stock';

interface MyRankProps {
  stockInfos: StockInfo[];
  hasTagButton: boolean;
  handleAddTag?: (tag: string) => void;
}

function MyRank({ stockInfos, hasTagButton, handleAddTag }: MyRankProps) {
  const [infoOpenCodes, setInfoOpenCodes] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

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

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  const showAllBtn = (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 50,
      }}
    >
      <Button onClick={toggleShowAll}>{showAll ? '목록 닫기' : '전체 보기'}</Button>
    </div>
  );

  const ListParts = (source: StockInfo[], isFirst: boolean, hasLoadMore: boolean) => (
    <List
      size="large"
      dataSource={source}
      loadMore={hasLoadMore && showAllBtn}
      renderItem={(item, index) => (
        <List.Item
          style={{
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <Card
            bordered={false}
            style={{
              background: 'none',
              width: '100%',
            }}
            bodyStyle={{
              padding: '12px 0px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {isFirst && (
                    <>
                      {index === 0 && <Emoji symbol="🥇" />}
                      {index === 1 && <Emoji symbol="🥈" />}
                      {(index === 2 || index === 3) && <Emoji symbol="🥉" />}{' '}
                    </>
                  )}

                  <Space size={4}>
                    <strong style={{ fontSize: 18 }}>{item.name}</strong>
                    <span>{item.code}</span>
                    <Tag>{item.market}</Tag>
                  </Space>
                </div>
                {hasTagButton && (
                  <Button type="link" onClick={() => handleAddTag && handleAddTag(item.name)}>
                    태그
                  </Button>
                )}
              </div>
              <Button
                style={{ border: 0, boxShadow: 'none', paddingRight: 0 }}
                onClick={() => toggleInfoOpen(item.code)}
              >
                <RightOutlined rotate={infoOpenCodes.includes(item.code) ? 90 : 0} />
              </Button>
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
  );

  return (
    <div className="MyRank">
      {ListParts(showAll ? stockInfos.slice(0, 8) : stockInfos.slice(0, 4), true, !showAll)}

      {showAll && (
        <>
          <Divider dashed={true}>여기부턴 16강 탈락!</Divider>
          {ListParts(stockInfos.slice(8, 16), false, false)}
          <Divider dashed={true}>차트만 보고 걸렀지만.. 다시보니 선녀?!</Divider>
          {ListParts(stockInfos.slice(16), false, showAll)}
        </>
      )}
    </div>
  );
}

MyRank.defaultProps = {
  partialDisplay: 'none',
};

export default MyRank;
