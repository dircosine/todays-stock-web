import React from 'react';
import { Table, Space, Tag, Tooltip } from 'antd';
import { TodaysStat, StockInfo } from '../lib/stock';
import { ColumnsType } from 'antd/lib/table';
import { InfoCircleOutlined } from '@ant-design/icons';

interface TodaysRankTableProps {
  todaysStat: TodaysStat[];
}

function TodaysRankTable({ todaysStat }: TodaysRankTableProps) {
  const columns: ColumnsType<TodaysStat> = [
    {
      title: '순위',
      dataIndex: 'rank',
      align: 'center',
      render: (myRank: number) => <div style={{ textAlign: 'center' }}>{myRank}</div>,
      sorter: (a: any, b: any) => a.myRank - b.myRank,
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'descend',
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
      title: (
        <Tooltip title="모든 유저의 결과를 취합하여 산정된 점수입니다" placement="right">
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
