import React, { useState } from 'react';
import { Input, Button, Typography, Checkbox } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import './JoinTemplate.scss';
import SpaceHorizontal from '../SpaceHorizontal';
import { useMutation } from '@apollo/react-hooks';
import { PUT_USER, LOCAL_LOG_IN } from '../../lib/queries';
import { scorebookGuideImg } from '../../img';
import Emoji from '../Emoji';
import SpaceVertical from '../SpaceVertical';
import { formatEventDate } from '../../lib/utils';

interface JoinTemplateProps {}

function JoinTemplate(props: JoinTemplateProps) {
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);

  const [putUserMutation] = useMutation(PUT_USER);
  const [localLoginMutation] = useMutation(LOCAL_LOG_IN);

  const getNoticeDate = () => {
    if (agree) {
      const today = new Date();
      today.setDate(today.getDate() + 3);
      return formatEventDate(today);
    } else {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const resultIds: number[] = JSON.parse(localStorage.getItem('resultIds') || '[]');
    try {
      const {
        data: { putUser },
      } = await putUserMutation({
        variables: { email, resultIds, noticeDate: getNoticeDate() },
      });
      localStorage.removeItem('resultIds');
      await localLoginMutation({ variables: { email: putUser.email } });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <div className="JoinTemplate">
      <div className="two-column">
        <div className="column-1">
          <div className="panel submit">
            <h3>채점 신청</h3>
            <p>별도 가입과정 없이 메일 주소만으로 신청하세요!</p>
            <form className="join-form" onSubmit={handleSubmit}>
              <strong className="input-label">
                <span>e-mail</span>
              </strong>
              <Input
                className="email-input"
                placeholder="실제 사용중인 메일 주소를 입력해 주세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                prefix={<MailOutlined />}
              />
              <SpaceHorizontal />
              <Checkbox
                className="checkbox-agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              >
                첫 채점이 완료되면 알림 메일을 보내드릴게요
              </Checkbox>
              <SpaceHorizontal />
              <Button
                className="submit-btn"
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={!email}
              >
                신청
              </Button>
            </form>
          </div>
          <SpaceHorizontal />
        </div>
        <SpaceVertical />
        <div className="column-2">
          <div className="panel scroebook-guide">
            <h3>
              <Emoji symbol="🎉" />
              채점 기능 오픈!
            </h3>
            <Typography.Text mark>내가 좋게 본 종목의 실제 예후는 어땠을까?</Typography.Text>
            <p>제가 대신 추적해서 결과를 알려드릴게요!</p>
            <Emoji className="pin-emoji" symbol="📌" size={24} />
            <img
              className="guide-img"
              src={scorebookGuideImg}
              alt="scorebookGuideImg"
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinTemplate;
