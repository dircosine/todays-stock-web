import React, { useState, useEffect } from 'react';
import { Layout, Menu, message, Modal } from 'antd';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { ClickParam } from 'antd/lib/menu';
import { Logo } from '../img';
import { getTargetEventDate } from '../lib/utils';

interface HeaderProps {}

function Header(props: HeaderProps) {
  const history = useHistory();
  const location = useLocation();
  const [current, setCurrent] = useState('/' + location.pathname.split('/')[1]);

  useEffect(() => {
    setCurrent('/' + location.pathname.split('/')[1]);
  }, [location]);

  const handleMenuClick = (e: ClickParam) => {
    switch (e.key) {
      case '/':
        setCurrent(e.key);
        break;
      case '/forum':
      case '/scorebook':
        hasRecord()
          ? history.push(e.key)
          : message.warning('먼저 오늘의 토너먼트를 완료해 주세요', 3);
        break;
      // case '/scorebook':
      //   Modal.info({
      //     title: '채점 기능은 지금 열심히 만들고 있습니다...',
      //     content: (
      //       <div>
      //         <br />
      //         <br />
      //         <br />
      //         <br />
      //         <p>오늘 직접 선정한 토너먼트 결과를 가지고,</p>
      //         <p>
      //           <strong>향후의 실제 주가 변동에 따른 수익률을 계산해 드립니다! </strong>
      //         </p>
      //         <br />
      //         <p>
      //           내 차트보는 눈이 어느 정도인지 확인해 보세요 <Emoji symbol="😆" />
      //         </p>
      //       </div>
      //     ),
      //     onOk() {},
      //   });
      //   break;
    }
  };

  const hasRecord = (): boolean => {
    const targetEventDate = getTargetEventDate(new Date());
    const doneDates: string[] = JSON.parse(localStorage.getItem('doneDates') || '[]');
    return doneDates.includes(targetEventDate) ? true : false;
  };

  return (
    <Layout.Header>
      <Logo className="logo" />

      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[current]}
        selectedKeys={[current]}
        onClick={handleMenuClick}
      >
        <Menu.Item key="/">
          {current !== '/' ? <Link to="/">오늘의 토너먼트</Link> : '오늘의 토너먼트'}
        </Menu.Item>
        <Menu.Item key="/forum">객장</Menu.Item>
        <Menu.Item key="/scorebook">채점</Menu.Item>
      </Menu>
    </Layout.Header>
  );
}

export default Header;
