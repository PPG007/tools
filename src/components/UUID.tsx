import { MehOutlined } from '@ant-design/icons';
import { App, Button, Flex, Result, Space } from 'antd';
import { FC, useState } from 'react';
import { v1, v4 } from 'uuid';

const UUID: FC = () => {
  const [id, setId] = useState(v4());
  const { message } = App.useApp();
  const newId = (version: 'v1' | 'v4') => {
    switch (version) {
      case 'v1':
        setId(v1());
        break;
      case 'v4':
        setId(v4());
        break;
    }
  };
  const onCopy = async () => {
    await navigator.clipboard.writeText(id);
    await message.success('copied');
  };
  return (
    <Flex vertical justify={'space-around'} align={'center'} style={{ height: '99vh', width: '100%' }}>
      <Space>
        <Result
          title={id}
          extra={
            <Button type={'primary'} onClick={onCopy} size={'large'}>
              Copy
            </Button>
          }
          icon={<MehOutlined />}
        />
      </Space>

      <Space size={'large'}>
        <Button
          type={'primary'}
          onClick={() => {
            newId('v1');
          }}
          size={'large'}
        >
          Generate UUID v1
        </Button>

        <Button
          type={'primary'}
          onClick={() => {
            newId('v4');
          }}
          size={'large'}
        >
          Generate UUID v4
        </Button>
      </Space>
    </Flex>
  );
};

export default UUID;
