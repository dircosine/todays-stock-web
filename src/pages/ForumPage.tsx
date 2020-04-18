import React from 'react';
import stockInfos from '../sample_stock_infos.json';
import ForumTemplate from '../components/templates/ForumTemplate';

type ForumPageProps = {};

function ForumPage(props: ForumPageProps) {
  return <ForumTemplate stockInfos={stockInfos} />;
}

export default ForumPage;
