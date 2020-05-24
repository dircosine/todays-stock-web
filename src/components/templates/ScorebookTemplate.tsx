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
import { eventDate2Displayable, calcAfterDate, formatEventDate } from '../../lib/utils';

interface ScorebookTemplateProps {}

function ScorebookTemplate(props: ScorebookTemplateProps) {
  const history = useHistory();
  const { data, loading } = useQuery(GET_TOURNAMENT_RESULTS, {
    variables: { userEmail: localStorage.getItem('email') },
  });

  if (loading) return <Loader />;

  const actions = (targetDate: string) => {
    return [1, 10, 20].map((after) => {
      const afterDate = calcAfterDate(targetDate, `after${after}`);
      const nowDate = formatEventDate(new Date(), false);
      return (
        <Button
          type="link"
          style={{ padding: 0 }}
          onClick={() => {
            window.scrollTo(0, 0);
            history.push(`/scorebook/${targetDate}/${after}`);
          }}
          disabled={afterDate > nowDate}
        >
          {after}일
        </Button>
      );
    });
  };

  return (
    <div className="ScorebookTemplate">
      <div className="head">
        <h2 className="stage-title">
          <Emoji symbol="💯" />
          채점
        </h2>
      </div>
      <SpaceHorizontal />
      <div className="history">
        <h3>완료한 토너먼트 회차</h3>
        <p>경과 기간을 선택해서 채점 결과를 확인해 보세요</p>
        <List
          dataSource={data.getTournamentResults}
          renderItem={(item: TournamentReuslt, index) => (
            <List.Item actions={actions(item.tournament.eventDate)}>
              {eventDate2Displayable(item.tournament.eventDate)}
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}

export default ScorebookTemplate;
