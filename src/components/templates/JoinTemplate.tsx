import React, { useState } from 'react';
import { Card, Input, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import './JoinTemplate.scss';
import SpaceHorizontal from '../SpaceHorizontal';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_USER, LOCAL_LOG_IN } from '../../lib/queries';

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
    <Card className="JoinTemplate">
      <div className="card-body">
        <h2>채점 신청</h2>
        <p>이메일 주소만으로 채점을 신청할 수 있습니다!</p>
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
    </Card>
  );
}

export default JoinTemplate;
