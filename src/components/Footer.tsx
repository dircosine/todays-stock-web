import React from 'react';
import { Layout } from 'antd';

interface FooterProps {}

function Footer(props: FooterProps) {
  return (
    <Layout.Footer style={{ textAlign: 'center' }}>
      문의 및 건의사항 메일주세요~
      <br />
      <a style={{ textDecoration: 'underline' }} href="mailto:contact.chartys@gmail.com">
        contact.chartys@gmail.com
      </a>
    </Layout.Footer>
  );
}

export default Footer;
