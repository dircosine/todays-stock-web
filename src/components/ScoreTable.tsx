import React, { useState } from 'react';
import { Table, Space, Tag, Spin, Divider } from 'antd';
import { ChangeInfo } from './templates/ScorebookDetailTemplate';
import { ColumnsType } from 'antd/lib/table';

import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

import './ScoreTable.scss';
import SpaceHorizontal from './SpaceHorizontal';
import Emoji from './Emoji';

interface ScoreTableProps {
  changeInfos: ChangeInfo[];
}
function ScoreTable({ changeInfos }: ScoreTableProps) {
  const coloringCriteria = (value: number): string => {
    return value > 0 ? 'red' : value < 0 ? 'blue' : 'black';
  };

  const columns: ColumnsType<ChangeInfo> = [
    {
      title: '내가 뽑은 순위',
      dataIndex: 'myRank',
      align: 'center',
      render: (myRank) => (
        <div style={{ textAlign: 'center' }}>
          {myRank < 4 ? (
            <div>
              {myRank === 0 && <Emoji symbol="🥇" />}
              {myRank === 1 && <Emoji symbol="🥈" />}
              {myRank === 2 && <Emoji symbol="🥉" />}
              {myRank === 3 && <Emoji symbol="🥉" />}
            </div>
          ) : (
            <strong>{myRank + 1}</strong>
          )}
        </div>
      ),
      sorter: (a, b) => a.myRank - b.myRank,
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'ascend',
    },
    {
      title: '종목명',
      dataIndex: 'name',
      render: (name: string, record: ChangeInfo) => (
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
      title: '수익률(%)',
      dataIndex: 'changePercent',
      className: 'score-percent-column',
      align: 'center',
      render: (changePercent: number) => (
        <div className={coloringCriteria(changePercent)}>
          <strong>{changePercent}</strong>
        </div>
      ),
      sorter: (a, b) => a.changePercent - b.changePercent,
      sortDirections: ['descend', 'ascend'],
    },
  ];

  const displayChange = (value: number) => {
    const valString = String(value);
    return valString.slice(0, 1) === '-' ? (
      <>
        <CaretDownOutlined /> {valString.slice(1)}
      </>
    ) : valString === '0' ? (
      '-'
    ) : (
      <>
        <CaretUpOutlined /> {valString}
      </>
    );
  };

  return (
    <Table
      style={{ margin: '0px -24px' }}
      // pagination={{ defaultPageSize: 8, position: ['bottomCenter'] }}
      pagination={false}
      dataSource={changeInfos}
      columns={columns}
      rowKey={(record) => record.code}
      showSorterTooltip={false}
      expandable={{
        expandedRowRender: (record: ChangeInfo) => (
          <div className="expanded">
            <div className="chart-wrap">
              <img src={record.afterChartSrc} alt={`${record.name} 차트`} width="100%" />
            </div>
            <SpaceHorizontal />
            <div className="price-wrap">
              <table style={{ textAlign: 'center' }}>
                <tbody>
                  <tr>
                    <td>05월 20일 종가</td>
                    <td>1일간 변동</td>
                    <td>05월 21일 종가</td>
                  </tr>
                  <tr>
                    <td className="price">
                      <em>{record.beforePrice}</em>
                    </td>
                    <td className={coloringCriteria(record.change)}>
                      {displayChange(record.change)}
                    </td>
                    <td className="price">
                      <em>{record.afterPrice}</em>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* <span className="price">
                <em>{record.beforePrice}</em>
              </span>

              <span className={coloringCriteria(record.change)}>
                {displayChange(record.change)}
              </span>

              <span className="price">
                <em>{record.afterPrice}</em>
              </span> */}
            </div>
          </div>
        ),
      }}
    />
  );
}

export default ScoreTable;
