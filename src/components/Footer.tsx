import React from 'react';
import { Layout } from 'antd';

interface FooterProps {}

function Footer(props: FooterProps) {
  return (
    <Layout.Footer style={{ textAlign: 'center' }}>
      Ant Design ©2018 Created by Ant UED
    </Layout.Footer>
  );
}

export default Footer;
