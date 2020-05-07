import React, { useState, ReactNode } from 'react';
import { Input, Button } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';

interface SharePanelProps {
  message?: string | ReactNode;
}

function SharePanel({ message }: SharePanelProps) {
  const [copyDone, setCopyDone] = useState(false);
  const url = document.location.href.split('/').slice(0, 3).join('/');

  const handleCopy = () => {
    setCopyDone(true);
  };

  return (
    <div className="SharePanel panel">
      <h3>공유</h3>
      {message ? (
        message
      ) : (
        <p>
          참여자가 많을수록
          <br /> 더 나은 통계와 더 많은 의견들을 확인할 수 있습니다!
        </p>
      )}
      <div style={{ display: 'flex' }}>
        <Input style={{ flex: 1 }} value={url} disabled />
        <CopyToClipboard text={url} onCopy={handleCopy}>
          <Button
            className="copy-btn"
            style={{ marginLeft: 4 }}
            type={copyDone ? 'default' : 'primary'}
            icon={copyDone ? <CheckOutlined /> : <CopyOutlined />}
          >
            {copyDone ? '' : '복사'}
          </Button>
        </CopyToClipboard>
      </div>
    </div>
  );
}

export default SharePanel;
