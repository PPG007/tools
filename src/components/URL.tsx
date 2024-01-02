import { Button, Flex, Input, Space } from 'antd';
import { FC, useState } from 'react';
import { decodeHttpURL, encodeHttpURL } from '../utils';

const URL: FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  return (
    <Flex gap={'large'} align={'center'} justify={'center'} vertical>
      <Input.TextArea
        value={input}
        onChange={(e) => {setInput(e.target.value)}}
        styles={{
          textarea: {
            height: '400px',
          },
        }}
      />
      <Space>
        <Button type={'primary'} onClick={() => {setOutput(encodeHttpURL(input))}}>encode</Button>
        <Button type={'primary'} onClick={() => {setOutput(decodeHttpURL(input))}}>decode</Button>
      </Space>
      <Input.TextArea
        readOnly
        value={output}
        styles={{
          textarea: {
            height: '400px',
          },
        }}
      />
    </Flex>
  )
}

export default URL;