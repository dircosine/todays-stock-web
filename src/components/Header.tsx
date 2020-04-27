import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { ClickParam } from 'antd/lib/menu';

interface HeaderProps extends RouteComponentProps {}

function Header({ location }: HeaderProps) {
  const [current, setCurrent] = useState(location.pathname);
  const handleMenuClick = (e: ClickParam) => {
    setCurrent(e.key);
  };

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location]);

  return (
    <Layout.Header>
      <Link to="/">
        <div className="logo" />
      </Link>

      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[current]}
        selectedKeys={[current]}
        onClick={handleMenuClick}
      >
        <Menu.Item key="/">
          <Link to="/">오늘의 토너먼트</Link>
        </Menu.Item>
        <Menu.Item key="/forum">
          <Link to="/forum">오늘의 포럼</Link>
        </Menu.Item>
      </Menu>
    </Layout.Header>
  );
}

export default withRouter(Header);
