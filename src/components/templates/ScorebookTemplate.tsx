import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_TOURNAMENT_RESULTS, UPDATE_USER } from '../../lib/queries';
import Loader from '../Loader';
import Emoji from '../Emoji';
import SpaceHorizontal from '../SpaceHorizontal';
import SpaceVertical from '../SpaceVertical';
import './ScorebookTemplate.scss';
import { List, Button, Typography, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { TournamentReuslt } from '../../lib/stock';
import { eventDate2Displayable, calcAfterDate, formatEventDate } from '../../lib/utils';

interface ScorebookTemplateProps {}

function ScorebookTemplate(props: ScorebookTemplateProps) {
  const history = useHistory();
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const { data, loading } = useQuery(GET_TOURNAMENT_RESULTS, {
    variables: { userEmail: localStorage.getItem('email') },
  });
  const [updateUserMutation] = useMutation(UPDATE_USER);

  const handleEmailChange = async (value: string) => {
    if (!value) return;
    if (value === email) return;

    const hide = message.loading('', 0);
    try {
      const {
        data: { updateUser },
      } = await updateUserMutation({
        variables: { email, newEmail: value },
      });
      localStorage.setItem('email', updateUser.email);
      setEmail(updateUser.email);
    } catch (e) {
      if (e.message.includes('Unique')) {
        message.warning('이미 사용중인 메일 주소입니다', 3);
      }
    } finally {
      hide();
    }
  };

  if (loading) return <Loader />;

  // const dates: string[] = [];
  // const removeDuplicateDate = data.getTournamentResults.filter((result: TournamentReuslt) => {
  //   if (!dates.includes(result.tournament.eventDate)) {
  //     dates.push(result.tournament.eventDate);
  //     return result;
  //   }
  // });

  // console.log(removeDuplicateDate);

  const removeDuplicateDate = () => {
    const dates: string[] = [];
    return data.getTournamentResults.filter((result: TournamentReuslt) => {
      if (!dates.includes(result.tournament.eventDate)) {
        dates.push(result.tournament.eventDate);
        return result;
      }
    });
  };

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
      <div className="user-info">
        <span>
          <strong>e-mail</strong>
        </span>
        <Typography.Paragraph editable={{ onChange: handleEmailChange }}>
          {email}
        </Typography.Paragraph>{' '}
      </div>
      <SpaceHorizontal />
      <div className="history">
        <h3>완료한 토너먼트 회차</h3>
        <p>경과 기간을 선택해서 채점 결과를 확인해 보세요</p>
        <List
          dataSource={removeDuplicateDate()}
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
