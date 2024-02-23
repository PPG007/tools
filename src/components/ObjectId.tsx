import { MehOutlined } from '@ant-design/icons';
import { App, Button, Card, DatePicker, Flex, Input, Result, Space } from 'antd';
import { ObjectID } from 'bson';
import dayjs from 'dayjs';
import { FC, useState } from 'react';
import { CardTab, getTabContent } from '../types.ts';

const Random: FC = () => {
  const [ id, setId ] = useState(() => {
    const oid = new ObjectID();
    return oid.toHexString();
  });
  const { message } = App.useApp();
  const onCopy = async () => {
    await navigator.clipboard.writeText(id);
    await message.success('copied');
  };
  return (
    <Flex
      vertical
      justify={ 'space-around' }
      align={ 'center' }
      style={ { height: '99vh', width: '100%' } }
    >
      <Space>
        <Result
          title={ id }
          extra={
            <Button type={ 'primary' } onClick={ onCopy } size={ 'large' }>
              Copy
            </Button>
          }
          icon={ <MehOutlined/> }
        />
      </Space>
      <Space size={ 'large' }>
        <Button
          type={ 'primary' }
          onClick={ () => {
            setId(() => {
              return (new ObjectID()).toHexString();
            });
          } }
          size={ 'large' }
        >
          Generate
        </Button>
      </Space>
    </Flex>
  );
};

interface ObjectIdInput {
  objectId: string;
  time: dayjs.Dayjs | null;
}

const FromTime: FC = () => {
  const [ input, setInput ] = useState<ObjectIdInput>({
    objectId: '',
    time: null,
  });
  const parseObjectId = () => {
    if (ObjectID.isValid(input.objectId)) {
      return ObjectID.createFromHexString(input.objectId).getTimestamp().toISOString();
    }
    return '';
  };

  const genObjectId = () => {
    if (input.time) {
      return ObjectID.createFromTime(input.time.unix()).toHexString();
    }
    return '';
  };
  return (
    <Flex
      gap={ 'large' }
      vertical={ true }
      align={ 'center' }
      justify={ 'center' }
    >
      <Space align={ 'center' } size={ 'large' }>
        <Input
          value={ input.objectId }
          onChange={ (e) => {
            setInput({
              ...input,
              objectId: e.target.value,
            });
          } }
          style={ {
            width: '250px'
          } }
        />
        <span>对应的时间为：</span>
        <Input
          readOnly
          value={ parseObjectId() }
          style={ {
            width: '250px'
          } }
        />
      </Space>
      <Space align={ 'center' } size={ 'large' }>
        <DatePicker
          format={ 'YYYY-MM-DD HH:mm:ss' }
          showTime
          onChange={ (time) => {
            setInput({ ...input, time });
          } }
          style={ {
            width: '250px'
          } }
        />
        <span>此时间对应的 objectId：</span>
        <Input
          readOnly
          value={ genObjectId() }
          style={ {
            width: '250px'
          } }
        />
      </Space>
    </Flex>
  );
};

const tabs: Array<CardTab> = [
  {
    label: '创建随机 objectId',
    key: 'random',
    content: <Random/>,
  },
  {
    label: '从时间创建 objectId',
    key: 'fromTime',
    content: <FromTime/>,
  },
];

const ObjectId: FC = () => {
  const [ tab, setTab ] = useState('random');
  return (
    <Card
      tabList={ tabs }
      activeTabKey={ tab }
      onTabChange={ (t) => {
        setTab(t);
      } }
    >
      {
        getTabContent(tabs, tab)
      }
    </Card>
  );
};

export default ObjectId;