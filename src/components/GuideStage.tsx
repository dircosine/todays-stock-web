import React, { useState, useEffect, useRef, ReactNode } from 'react';
import Emoji from './Emoji';
import { Card, Divider, Button, Space } from 'antd';
import SpaceHorizontal from './SpaceHorizontal';
import './GuideStage.scss';

interface GuideStageProps {
  goNextStage: () => void;
}

type YesOrNo = 'yes' | 'no';

const messagePrepare: { [key: string]: ReactNode[] } = {
  yes: [
    <div>
      <p>
        좋아요 <Emoji symbol="👍" />
      </p>
      <p>놓치고 있던 보석같은 종목을 발견할 기회입니다!</p>
      <p>'뭐 살만한 거 없나?' 더이상 고민하지 않아도 되구요.</p>
    </div>,
    <div>
      <p>방법은 정말 간단합니다.</p>
      <p>잠시 후 부터 여러개의 개별 종목 차트를 제시해 드릴텐데요.</p>
      <p>
        동시에 표시되는 두 종목 중, 향후 전망이 더 좋아보이는 쪽을 선택만 하면 됩니다!{' '}
        <span className="small">(이상형 월드컵)</span>
      </p>
    </div>,
    <div>
      <p>
        오늘의 토너먼트를 완료하면,
        <br />
        분명 괜찮은 종목 몇 개 정도는 건질 수 있을 거에요.
      </p>
      <p>다른 유저들의 의견과 오늘의 통계도 놓치지 마시구요.</p>
    </div>,
    <div>
      <Emoji symbol="💯" />
      <p>오늘 선택한 결과는, 향후 실제 주가 변동에 따라 수익률 채점도 해 드립니다.</p>
      <p>
        마지막으로, 매일 자정 새로운 종목으로 업데이트 되니, 내일도 쓱 한번 들러주세요{' '}
        <Emoji symbol="😀" />
      </p>
    </div>,
  ],
  no: [
    <div>
      <p>
        그래도 괜찮습니다 <Emoji symbol="👍" />
      </p>
      <p>조금씩 눈에 익혀가면 되니까요!</p>
      <p>매일 오늘의 토너먼트를 진행하며 감을 익혀보세요.</p>
    </div>,
    <div>
      <p>방법은 정말 간단합니다.</p>
      <p>잠시 후 부터 여러개의 개별 종목 차트를 제시해 드릴텐데요.</p>
      <p>
        동시에 표시되는 두 종목 중, 향후 전망이 더 좋아보이는 쪽을 선택만 하면 됩니다!{' '}
        <span className="small">(이상형 월드컵)</span>
      </p>
      <p>부담없이 느낌대로 골라 보세요.</p>
    </div>,
    <div>
      <p>
        오늘의 토너먼트를 완료하면,
        <br />
        다른 유저들의 의견과 오늘의 통계를 확인할 수 있습니다.
      </p>
      <p>내가 선택한 결과와 비교해 보세요.</p>
    </div>,
    <div>
      <Emoji symbol="💯" />
      <p>오늘 선택한 결과는, 향후 실제 주가 변동에 따라 수익률 채점도 해 드립니다.</p>
      <p>
        마지막으로, 매일 자정 새로운 종목으로 업데이트 되니, 내일도 쓱 한번 들러주세요{' '}
        <Emoji symbol="😀" />
      </p>
    </div>,
  ],
};

const buttonLabelPrepare: string[] = ['어떻게?', '이해했어요', '알겠어요'];

function GuideStage({ goNextStage }: GuideStageProps) {
  const [answer, setAnswer] = useState<YesOrNo>();
  const [messages, setMessages] = useState<ReactNode[]>();
  const [startVisible, setStartVisible] = useState(false);
  const messageIndex = useRef(1);

  const skipTutorial = localStorage.getItem('skipTutorial');

  useEffect(() => {
    if (answer) {
      setMessages(messagePrepare[answer].slice(0, messageIndex.current));
    }
  }, [answer]);

  const handleNext = () => {
    if (!answer) return;
    messageIndex.current += 1;

    setMessages(messagePrepare[answer].slice(0, messageIndex.current));
    if (messageIndex.current === messagePrepare[answer].length) {
      setStartVisible(true);
    }
  };

  const handleStart = () => {
    if (!skipTutorial) {
      localStorage.setItem('skipTutorial', 'true');
    }
    if (goNextStage) goNextStage();
  };

  return (
    <div className="guide-stage">
      <Card title={skipTutorial ? '' : '시작하기 전에..'}>
        {skipTutorial ? (
          <ul className="guide" style={{ textAlign: 'center', padding: '30px 0px' }}>
            <li>
              지금 바로 오늘의 토너먼트를 완료하세요 <Emoji symbol="😀" />
            </li>
          </ul>
        ) : (
          <ul className="guide">
            <li className={`${!answer && 'active'}`}>
              <p style={{ margin: '30px 0px' }}>
                Q.
                <br />
                주식 차트 좀 볼 줄 아시나요?
              </p>
            </li>
            <SpaceHorizontal height={40} />
            {messages?.map((line, index) => {
              return (
                <li
                  key={index}
                  className={`fade-in ${index === messageIndex.current - 1 && 'active'}`}
                >
                  {line}
                  <SpaceHorizontal height={40} />
                </li>
              );
            })}
          </ul>
        )}

        {!startVisible && !skipTutorial && (
          <>
            <SpaceHorizontal height={40} />
            {answer ? (
              <Button
                className="fade-in"
                shape="round"
                type="primary"
                size="large"
                onClick={handleNext}
              >
                {buttonLabelPrepare[messageIndex.current - 1]}
              </Button>
            ) : (
              <Space size="large">
                <Button shape="round" size="large" onClick={() => setAnswer('yes')}>
                  예
                </Button>
                <Button shape="round" size="large" onClick={() => setAnswer('no')}>
                  아니오
                </Button>
              </Space>
            )}
          </>
        )}
        {(startVisible || skipTutorial) && (
          <>
            <Divider type="horizontal" />
            <div style={{ marginBottom: 24 }}>
              <strong>32강</strong> 부터
            </div>
            <Button style={{ width: 200 }} shape="round" type="primary" onClick={handleStart}>
              시작
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

export default GuideStage;
