import React from 'react';
import Emoji from './Emoji';
import { Card, Divider, Button } from 'antd';

interface GuideStageProps {
  goNextStage: () => void;
  loading: boolean;
}

function GuideStage({ goNextStage, loading }: GuideStageProps) {
  return (
    <div className="guide-stage">
      <Card title={'어떻게 하나요?'}>
        <ul className="guide" style={{ textAlign: 'center' }}>
          <li>
            <Emoji symbol="✨" />
            <p>
              <strong>매일 32개의 새로운 주식 종목</strong>이 준비됩니다
            </p>
          </li>
          <li>
            <Emoji symbol="🤔" />
            <p>
              동시에 표시되는 두 종목 중,
              <br />
              향후 전망이 더 좋아보이는 쪽을 선택해 주세요
            </p>
          </li>
          <li>
            <Emoji symbol="🏅" />
            <p>
              토너먼트를 진행하며 최고의 종목을 선정해 주세요!
              <br />
              <span className="small">32강-16강-8강-4강-결승</span>
            </p>
          </li>
          <li>
            <Emoji symbol="💡" />
            <p>
              다 끝나면 <strong>"오늘의 포럼"</strong>
              에서 투자 아이디어를 얻어 가세요!
            </p>
          </li>
          <li>
            <Emoji symbol="👀" />
            <p>
              <strong>내일도 쓱 한 번 들러주세요!</strong>
              <br />
              <span className="small"> (오후 7시 종목 업데이트)</span>
            </p>
          </li>
        </ul>
        <Divider type="horizontal" />
        <Button
          style={{ width: 200 }}
          shape="round"
          type="primary"
          onClick={() => {
            if (goNextStage) goNextStage();
          }}
          loading={loading}
          disabled={loading}
        >
          시작
        </Button>
      </Card>
    </div>
  );
}

export default GuideStage;
