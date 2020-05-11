import React, { useState, ReactNode } from 'react';
import { Button } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CheckOutlined, ShareAltOutlined } from '@ant-design/icons';

interface SharePanelProps {
  message: string | ReactNode;
}

function SharePanel({ message }: SharePanelProps) {
  const [copyDone, setCopyDone] = useState(false);
  const url = document.location.href.split('/').slice(0, 3).join('/');

  const handleCopy = () => {
    setCopyDone(true);
  };

  return (
    <div className="SharePanel panel">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>공유</h3>
        <CopyToClipboard text={url} onCopy={handleCopy}>
          <Button
            className="copy-btn"
            style={{ marginLeft: 4 }}
            type={copyDone ? 'default' : 'primary'}
            icon={copyDone ? <CheckOutlined /> : <ShareAltOutlined />}
          >
            {copyDone ? '복사됨' : '주소 복사'}
          </Button>
        </CopyToClipboard>
      </div>
      <p>{message}</p>
    </div>
  );
}

export default SharePanel;
