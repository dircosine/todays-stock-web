import React from 'react';
import { Spin } from 'antd';

function Loader() {
  return (
    <div style={{ marginTop: 300, textAlign: 'center' }}>
      <Spin tip="Loading..." />
    </div>
  );
}

export default Loader;
