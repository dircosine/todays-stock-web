import React from 'react';
import { Table, Space, Button, Tag, Tooltip } from 'antd';
import { TodaysStat, StockInfo } from '../lib/stock';
import { ColumnsType } from 'antd/lib/table';
import { InfoCircleOutlined } from '@ant-design/icons';

interface TodaysRankTableProps {
  todaysStat: TodaysStat[];
  onAddTag: (name: string) => void;
}

function TodaysRankTable({ todaysStat, onAddTag }: TodaysRankTableProps) {
  const columns: ColumnsType<TodaysStat> = [
    {
      title: (
        <Tooltip title="모든 유저의 순위를 취합하여 산정된 점수입니다" placement="right">
          <span>
            <InfoCircleOutlined />
            <br />
            총점
          </span>
        </Tooltip>
      ),
      dataIndex: 'score',
      className: 'score-column',
      align: 'center',
      render: (score: number) => (
        <div style={{ textAlign: 'center' }}>
          <strong>{score}</strong>
        </div>
      ),
      defaultSortOrder: 'descend',
      sorter: (a: any, b: any) => a.score - b.score,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '종목명',
      dataIndex: 'name',
      render: (name: string, record: StockInfo) => (
        <>
          <strong style={{ fontSize: 18, marginRight: 4 }}>{name}</strong>
          <Space size={4}>
            <span>{record.code}</span>
            <Tag>{record.market}</Tag>
          </Space>
        </>
      ),
    },
    {
      title: '내 순위',
      dataIndex: 'myRank',
      className: 'myrank-column',
      align: 'center',
      width: 80,
      render: (myRank: number) => <div style={{ textAlign: 'center' }}>{myRank}</div>,
      sorter: (a: any, b: any) => a.myRank - b.myRank,
      sortDirections: ['descend', 'ascend'],
    },

    {
      //prettier-ignore
      title: <span>댓글<br/>태그</span>,
      dataIndex: 'action',
      className: 'tag-column',
      align: 'center',
      render: (_: null, record: StockInfo) => (
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
      dataSource={todaysStat}
      columns={columns}
      rowKey={(record) => record.code}
      showSorterTooltip={false}
    />
  );
}

export default TodaysRankTable;
