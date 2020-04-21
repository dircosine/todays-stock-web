import React from 'react';
import { StockInfo } from '../pages/TournamentPage';
import { Table, Space, Button, Tag } from 'antd';
import { StockInfoRank } from '../pages/ForumPage';

interface TodaysRankTableProps {
  todaysRank: StockInfoRank[] | undefined;
  onAddTag: (name: string) => void;
}

function TodaysRankTable({ todaysRank, onAddTag }: TodaysRankTableProps) {
  const columns = [
    {
      title: '순위',
      dataIndex: 'rank',
      render: (rank: string) => (
        <div style={{ textAlign: 'center' }}>{rank || '-'}</div>
      ),
    },
    {
      title: '종목명',
      dataIndex: 'name',
      render: (_: any, record: StockInfo) => (
        <Space size={4}>
          <strong style={{ fontSize: 18 }}>{record.name}</strong>
          <span>{record.code}</span>
          <Tag>{record.market}</Tag>
        </Space>
      ),
    },
    {
      title: '1위 확률',
      dataIndex: 'winRate',
      render: (winRate: string) => (
        <div style={{ textAlign: 'center' }}>{winRate || '-'}</div>
      ),
    },
    {
      title: '댓글 태그',
      dataIndex: 'action',
      render: (_: any, record: StockInfo) => (
        <Button type="link" onClick={() => onAddTag(record.name)}>
          태그
        </Button>
      ),
    },
  ];

  return (
    <Table
      style={{ margin: '0px -24px' }}
      pagination={{ defaultPageSize: 8, position: ['bottomCenter'] }}
      dataSource={todaysRank}
      columns={columns}
      rowKey={(record) => record.code}
    />
  );
}

export default TodaysRankTable;
