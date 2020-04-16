import React from 'react';
import { Layout } from 'antd';

import Header from '../Header';
import Footer from '../Footer';

import './BaseTemplate.scss';

type BaseTemplateProps = {
  children: React.ReactNode;
};

function BaseTemplate({ children }: BaseTemplateProps) {
  return (
    <Layout className="layout">
      <Header />
      <Layout.Content>
        <div className="content">{children}</div>
      </Layout.Content>
      <Footer />
    </Layout>
  );
}

export default BaseTemplate;
