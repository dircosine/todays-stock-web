import React from 'react';
import Emoji from './Emoji';
import { Card, Divider, Button, Space, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

interface GuideStageProps {
  goNextStage: () => void;
}

function GuideStage({ goNextStage }: GuideStageProps) {
  return (
    <div className="guide-stage">
      <Card>
        <ul className="guide" style={{ textAlign: 'center' }}>
          <li>
            <p>주식 차트 좀 보시나요?</p>
          </li>
          <li>
            <Emoji symbol="🤔" />
            <p>
              <strong>'뭐 살만한 거 없나?', 더이상 고민하지 마세요.</strong>
              <br />
              오늘의 토너먼트를 완료하면 저절로 알게 됩니다!
            </p>
          </li>
          <li>
            <Emoji symbol="🏅" />
            <p>
              동시에 표시되는 두 종목 중,
              <br />
              <strong>향방이 더 좋아보이는 쪽을 선택</strong>하면 끝!
            </p>
          </li>
        </ul>
        <Divider type="horizontal" />
        <div style={{ marginBottom: 16 }}>
          <strong>32강</strong> 부터
          <Divider type="vertical" />
          <Tooltip
            style={{ width: 360 }}
            title={
              <>
                순위 참여 기준시간입니다.
                <br />
                시간이 초과되더라도 신중히 선택하면 더 좋은 종목을 찾을 수 있을 거에요.
              </>
            }
            placement="top"
          >
            <Space>
              제한시간 <strong>5분</strong>
              <InfoCircleOutlined />
            </Space>
          </Tooltip>
        </div>
        <Button
          style={{ width: 200 }}
          shape="round"
          type="primary"
          onClick={() => {
            if (goNextStage) goNextStage();
          }}
        >
          시작
        </Button>
      </Card>
    </div>
  );
}

export default GuideStage;
