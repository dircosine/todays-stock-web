import React, { useState } from 'react';
import { Input, Button, Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import './JoinTemplate.scss';
import SpaceHorizontal from '../SpaceHorizontal';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_USER, LOCAL_LOG_IN } from '../../lib/queries';
import SpaceVertical from '../SpaceVertical';
import { scorebookGuideImg } from '../../img';
import Emoji from '../Emoji';

interface JoinTemplateProps {}

function JoinTemplate(props: JoinTemplateProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const [createUserMutation] = useMutation(CREATE_USER);
  const [localLoginMutation] = useMutation(LOCAL_LOG_IN);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const resultIds: number[] = JSON.parse(localStorage.getItem('resultIds') || '[]');
    try {
      const {
        data: { createUser },
      } = await createUserMutation({ variables: { email, resultIds } });
      localStorage.removeItem('resultIds');
      await localLoginMutation({ variables: { email: createUser.email } });
    } catch (e) {
      if (e.message.includes('Unique')) {
        localStorage.removeItem('resultIds');
        await localLoginMutation({ variables: { email } });
      } else {
        setLoading(false);
      }
    }
  };

  return (
    <div className="JoinTemplate">
      <div className="two-column">
        <div className="column-1">
          <div className="panel submit">
            <h3>채점 신청</h3>
            <p>별도 가입과정 없이 메일 주소만으로 신청하세요!</p>
            <strong className="input-label">
              <span>e-mail</span>
            </strong>

            <form className="join-form" onSubmit={handleSubmit}>
              <Input
                className="email-input"
                placeholder="이메일 주소를 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                prefix={<MailOutlined />}
              />
              <Typography.Text style={{ fontSize: 12 }} type="danger">
                *결과 저장에 사용됩니다. 실제 사용중인 메일 주소를 입력해 주세요
              </Typography.Text>
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
            <h3>채점 기능 오픈!</h3>
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
