import { Card, DatePicker, Flex, Input, InputNumber, Select, Space } from 'antd';
import { CardTabListType } from 'antd/es/card';
import { FC, ReactNode, useEffect, useState } from 'react';
import dayjs from 'dayjs';

interface Date {
  type: 'second' | 'millisecond';
  date: dayjs.Dayjs | null;
}

interface InputUnix {
  type: 'second' | 'millisecond';
  value: number;
}

const Unix: FC = () => {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [date, setDate] = useState<Date>({ type: 'second', date: null });
  const [inputUnix, setInputUnix] = useState<InputUnix>({
    type: 'second',
    value: 0,
  });
  const format = 'YYYY-MM-DD HH:mm:ss';
  useEffect(() => {
    const id = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 500);
    return () => {
      clearInterval(id);
    };
  }, []);
  const convertToTimestamp = () => {
    if (date.date) {
      if (date.type === 'second') {
        return date.date.unix();
      } else {
        return date.date.unix() * 1000;
      }
    }
    return undefined;
  };
  const convertTimestampToStr = () => {
    if (!inputUnix.value) {
      return '';
    }
    if (inputUnix.type === 'second') {
      return dayjs.unix(inputUnix.value).format(format);
    } else {
      return dayjs(inputUnix.value).format(format);
    }
  };
  return (
    <Flex gap={'large'} align={'center'} justify={'center'} vertical>
      <Space align={'center'}>
        <span>当前时间的时间戳为：</span>
        <Input value={now} readOnly />
      </Space>
      <Space>
        <DatePicker
          format={format}
          showToday={false}
          showNow={false}
          showTime
          onChange={(time) => {
            setDate({
              ...date,
              date: time,
            });
          }}
        />
        <span>转换为时间戳：</span>
        <Space.Compact>
          <Input readOnly value={convertToTimestamp()} style={{ width: '60%' }} />
          <Select
            style={{ width: '40%' }}
            options={[
              {
                value: 'second',
                label: '秒',
              },
              {
                value: 'millisecond',
                label: '毫秒',
              },
            ]}
            value={date.type}
            onChange={(value) => {
              setDate({
                ...date,
                type: value,
              });
            }}
          />
        </Space.Compact>
      </Space>
      <Space>
        <span>时间戳</span>
        <Space.Compact>
          <InputNumber
            value={inputUnix.value}
            onChange={(e) => {
              setInputUnix({
                ...inputUnix,
                value: e || 0,
              });
            }}
            controls={false}
            style={{ width: '60%' }}
          />
          <Select
            style={{ width: '40%' }}
            options={[
              {
                value: 'second',
                label: '秒',
              },
              {
                value: 'millisecond',
                label: '毫秒',
              },
            ]}
            value={inputUnix.type}
            onChange={(value) => {
              setInputUnix({
                ...inputUnix,
                type: value,
              });
            }}
          />
        </Space.Compact>
        <span>转换为字符串：</span>
        <Input readOnly value={convertTimestampToStr()} />
      </Space>
    </Flex>
  );
};

const ISO: FC = () => {
  const format = 'YYYY-MM-DD HH:mm:ss';
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  return (
    <Flex gap={'large'} align={'center'} justify={'center'} vertical>
      <Space>
      <DatePicker
          format={format}
          showToday={false}
          showNow={false}
          showTime
          onChange={(time) => {
            setDate(time);
          }}
        />
        <span>ISO8601：</span>
        <Input readOnly value={ date ? date.toISOString() : '' } />
      </Space>
    </Flex>
  )
}

interface CardTab extends CardTabListType {
  content?: ReactNode;
}

const tabs: Array<CardTab> = [
  {
    key: 'unix',
    label: '时间戳',
    content: <Unix />,
  },
  {
    key: 'iso',
    label: 'ISO8601',
    content: <ISO />,
  },
];

const getTabContent = (key: string) => {
  const tab = tabs.find((tab) => tab.key === key);
  if (tab) {
    return tab.content;
  }
  return undefined;
};

const Time: FC = () => {
  const [tab, setTab] = useState('unix');
  return (
    <Card
      tabList={tabs}
      activeTabKey={tab}
      onTabChange={(key) => {
        setTab(key);
      }}
    >
      {getTabContent(tab)}
    </Card>
  );
};

export default Time;
