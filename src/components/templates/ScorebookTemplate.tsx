import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_TOURNAMENT_RESULTS } from '../../lib/queries';
import Loader from '../Loader';
import Emoji from '../Emoji';
import SpaceHorizontal from '../SpaceHorizontal';
import SpaceVertical from '../SpaceVertical';
import './ScorebookTemplate.scss';
import { List, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { TournamentReuslt } from '../../lib/stock';
import { eventDate2Displayable } from '../../lib/utils';

interface ScorebookTemplateProps {}

function ScorebookTemplate(props: ScorebookTemplateProps) {
  const history = useHistory();
  const { data, loading } = useQuery(GET_TOURNAMENT_RESULTS, {
    variables: { userEmail: localStorage.getItem('email') },
  });

  if (loading) return <Loader />;

  return (
    <div className="ScorebookTemplate">
      <div className="head">
        <h2 className="stage-title">
          <Emoji symbol="💯" />
          채점
        </h2>
      </div>
      <SpaceHorizontal />
      <div className="two-column">
        <div className="column-1">
          <div className="panel dashboard">
            <h3>대시보드</h3>
          </div>
          <SpaceHorizontal />
        </div>
        <SpaceVertical />
        <div className="column-2">
          <div className="panel history">
            <h3>완료한 토너먼트</h3>
            <List
              dataSource={data.getTournamentResults.slice(1)}
              renderItem={(item: TournamentReuslt, index) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      onClick={() => {
                        history.push(`/scorebook/${item.tournament.eventDate}/${item.id}`);
                      }}
                    >
                      채점 결과 >
                    </Button>,
                  ]}
                >
                  {eventDate2Displayable(item.tournament.eventDate)}
                </List.Item>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScorebookTemplate;
