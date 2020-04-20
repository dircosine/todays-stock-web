import React, { useState } from 'react';
import { Input, Button } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';

type SharePanelProps = {
  // onCopy: () => void;
};

function SharePanel(props: SharePanelProps) {
  const [copyDone, setCopyDone] = useState(false);

  const handleCopy = () => {
    setCopyDone(true);
    // onCopy();
  };

  return (
    <div className="SharePanel panel">
      <h3>공유</h3>
      <div style={{ display: 'flex' }}>
        <Input style={{ flex: 1 }} value={document.location.href} disabled />
        <CopyToClipboard text={document.location.href} onCopy={handleCopy}>
          <Button
            className="copy-btn"
            style={{ marginLeft: 4 }}
            type={copyDone ? 'default' : 'ghost'}
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
