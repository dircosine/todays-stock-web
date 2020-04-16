import React from 'react';
import stockInfos from '../sample_stock_infos.json';
import BaseTemplate from '../components/templates/BaseTemplate';
import ForumTemplate from '../components/templates/ForumTemplate';

type ForumPageProps = {};

function ForumPage(props: ForumPageProps) {
  return (
    <BaseTemplate>
      <ForumTemplate stockInfos={stockInfos} />
    </BaseTemplate>
  );
}

export default ForumPage;
