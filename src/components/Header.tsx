import React, { useState, useEffect } from 'react';
import { Layout, Menu, Modal } from 'antd';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { ClickParam } from 'antd/lib/menu';
import { Logo } from '../img';
import Emoji from './Emoji';

interface HeaderProps extends RouteComponentProps {}

function Header({ location, history }: HeaderProps) {
  const [current, setCurrent] = useState(location.pathname);
  const handleMenuClick = (e: ClickParam) => {
    if (e.key === '/scorebook') return;
    setCurrent(e.key);
  };

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location]);

  const prepareInfoModal = () => {
    Modal.info({
      title: '채점 기능은 지금 열심히 만들고 있습니다...',
      content: (
        <div>
          <br />
          <br />
          <br />
          <br />
          <p>오늘 직접 선정한 토너먼트 결과를 가지고,</p>
          <p>
            <strong>향후의 실제 주가 변동에 따른 수익률을 계산해 드립니다! </strong>
          </p>
          <br />
          <p>
            내 차트보는 눈이 어느 정도인지 확인해 보세요 <Emoji symbol="😆" />
          </p>
        </div>
      ),
      onOk() {},
    });
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
        <Menu.Item key="/forum">
          <Link to="/forum">객장</Link>
        </Menu.Item>
        <Menu.Item key="/scorebook" onClick={prepareInfoModal}>
          채점
        </Menu.Item>
      </Menu>
    </Layout.Header>
  );
}

export default withRouter(Header);
