import { Button, Flex, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { FC, useState } from 'react';
import * as base64 from 'js-base64';

const Base64: FC = () => {
  const [input, setInput] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  });
  const encode = () => {
    if (!input.from) {
      return;
    }
    const encoded = base64.encode(input.from);
    setInput({
      ...input,
      to: encoded,
    });
  };
  const decode = () => {
    if (!input.from) {
      return;
    }
    const decoded = base64.decode(input.from);
    setInput({
      ...input,
      to: decoded,
    });
  };
  return (
    <Flex gap={'large'} align={'center'} justify={'center'} vertical>
      <TextArea
        styles={{
          textarea: {
            height: '400px',
          },
        }}
        value={input.from}
        onChange={(e) => {
          setInput({
            ...input,
            from: e.target.value,
          });
        }}
      />
      <Space>
        <Button type={'primary'} onClick={encode}>
          encode
        </Button>
        <Button type={'primary'} onClick={decode}>
          decode
        </Button>
      </Space>
      <TextArea
        styles={{
          textarea: {
            height: '400px',
          },
        }}
        value={input.to}
        readOnly
      />
    </Flex>
  );
};

export default Base64;
