import { Layout, Menu } from 'antd';
import { MenuItemType } from 'antd/es/menu/hooks/useItems';
import { FC, useState, ReactNode, useEffect } from 'react';
import style from './style/app.module.css';
import { Base64, URL, Json, Time, UUID, ObjectId } from './components';
import { ClockCircleOutlined } from '@ant-design/icons';
import { getQueryParam, refreshQuery } from './utils';

const { Sider, Content } = Layout;

interface MenuItem extends MenuItemType {
  content?: ReactNode;
}

const items: Array<MenuItem> = [
  {
    key: 'time',
    label: '时间',
    icon: <ClockCircleOutlined />,
    content: <Time />,
  },
  {
    key: 'base64',
    label: 'base64',
    content: <Base64 />,
  },
  {
    key: 'json',
    label: 'JSON',
    content: <Json />,
  },
  {
    key: 'uuid',
    label: 'UUID',
    content: <UUID />,
  },
  {
    key: 'url',
    label: 'URL',
    content: <URL />,
  },
  {
    key: 'objectId',
    label: 'ObjectId',
    content: <ObjectId />,
  }
];

const getContent = (key: string) => {
  const item = items.find((item) => item.key === key);
  if (item) {
    return item.content;
  }
  return undefined;
};

const App: FC = () => {
  const [menuKey, setMenuKey] = useState(() => {
    const menu = getQueryParam('menu');
    const item = items.findIndex((item) => (item.key as string) === menu);
    if (item >= 0) {
      return menu;
    }
    return items[0].key as string;
  });

  useEffect(() => {
    refreshQuery({
      menu: menuKey,
    });
  }, [menuKey]);

  return (
    <Layout hasSider>
      <Sider className={style.sidebar}>
        <Menu
          items={items}
          mode={'inline'}
          theme={'dark'}
          onSelect={({ key }) => {
            setMenuKey(key);
          }}
          selectedKeys={[menuKey]}
        />
      </Sider>
      <Layout>
        <Content>{getContent(menuKey)}</Content>
      </Layout>
    </Layout>
  );
};

export default App;
