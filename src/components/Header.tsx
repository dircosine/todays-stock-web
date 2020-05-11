import React, { useState, useEffect } from 'react';
import { Layout, Menu, message } from 'antd';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { ClickParam } from 'antd/lib/menu';
import { Logo } from '../img';

const { SubMenu } = Menu;

interface HeaderProps extends RouteComponentProps {}

function Header({ location, history }: HeaderProps) {
  const [current, setCurrent] = useState(location.pathname);
  const handleMenuClick = (e: ClickParam) => {
    setCurrent(e.key);
  };

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location]);

  const navMap: { [key: string]: string } = {
    '/': '토너먼트',
    '/stats': '통계',
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
        <SubMenu key="/" title={`오늘의 ${navMap[current] || '토너먼트'}`} style={{ background: '#001529' }}>
          <Menu.Item key="/">{current !== '/' ? <Link to="/">토너먼트</Link> : '토너먼트'}</Menu.Item>
          <Menu.Item key="/stats">통계</Menu.Item>
        </SubMenu>
        <Menu.Item key="/forum">
          <Link to="/forum">객장</Link>
        </Menu.Item>
      </Menu>
    </Layout.Header>
  );
}

export default withRouter(Header);
