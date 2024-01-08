import TextArea from 'antd/es/input/TextArea';
import { Flex, Checkbox, Space, Result, Select, Card, Button, App } from 'antd';
import { CSSProperties, FC, useEffect, useRef, useState } from 'react';
import JsonView, { JsonViewProps } from '@uiw/react-json-view';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import style from '../style/app.module.css';
import { lightTheme } from '@uiw/react-json-view/light';
import { darkTheme } from '@uiw/react-json-view/dark';
import { nordTheme } from '@uiw/react-json-view/nord';
import { githubLightTheme } from '@uiw/react-json-view/githubLight';
import { githubDarkTheme } from '@uiw/react-json-view/githubDark';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import { gruvboxTheme } from '@uiw/react-json-view/gruvbox';
import { monokaiTheme } from '@uiw/react-json-view/monokai';
import { basicTheme } from '@uiw/react-json-view/basic';
import { CardTab, getTabContent } from '../types.ts';
import { copyToClipboard } from '../utils';

const getTheme = (name: string) => {
  switch (name) {
    case 'lightTheme':
      return lightTheme;
    case 'darkTheme':
      return darkTheme;
    case 'nordTheme':
      return nordTheme;
    case 'githubLightTheme':
      return githubLightTheme;
    case 'vscodeTheme':
      return vscodeTheme;
    case 'gruvboxTheme':
      return gruvboxTheme;
    case 'monokaiTheme':
      return monokaiTheme;
    case 'basicTheme':
      return basicTheme;
    default:
      return githubDarkTheme;
  }
};

const Viewer: FC<{ input: string }> = ({ input }) => {
  const [props, setProps] = useState<JsonViewProps<object>>({
    objectSortKeys: false,
    displayObjectSize: false,
    displayDataTypes: false,
    enableClipboard: false,
    value: {},
    style: lightTheme,
  });
  const [error, setError] = useState('githubDarkTheme');
  const ref = useRef(null);
  useEffect(() => {
    try {
      const obj = JSON.parse(input);
      setProps({
        ...props,
        value: obj,
      });
      setError('');
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('JSON 解析异常');
      }
    }
  }, [input, props]);
  const checkHandler = (prop: keyof JsonViewProps<object>) => (e: CheckboxChangeEvent) => {
    setProps({
      ...props,
      [prop]: e.target.checked,
    });
  };
  return (
    <Flex vertical gap={'middle'} justify={'start'} align={'center'} className={style['json-viewer-container']}>
      <Space size={'large'} align={'center'}>
        <Checkbox onChange={checkHandler('objectSortKeys')} checked={!!props.objectSortKeys}>
          对 key 进行排序
        </Checkbox>
        <Checkbox onChange={checkHandler('displayObjectSize')} checked={props.displayObjectSize}>
          显示对象及数组中的元素个数
        </Checkbox>
      </Space>
      <Space size={'large'} align={'center'}>
        <Checkbox onChange={checkHandler('displayDataTypes')} checked={props.displayDataTypes}>
          显示数据的类型
        </Checkbox>
        <Checkbox onChange={checkHandler('enableClipboard')} checked={props.enableClipboard}>
          显示复制按钮
        </Checkbox>
      </Space>
      <Space align={'center'}>
        <Select
          size={'large'}
          onChange={(e) => {
            setProps({
              ...props,
              style: getTheme(e),
            });
          }}
          style={{ width: '150px' }}
          defaultValue={'lightTheme'}
          options={[
            {
              label: 'lightTheme',
              value: 'lightTheme',
            },
            {
              label: 'darkTheme',
              value: 'darkTheme',
            },
            {
              label: 'nordTheme',
              value: 'nordTheme',
            },
            {
              label: 'githubLightTheme',
              value: 'githubLightTheme',
            },
            {
              label: 'githubDarkTheme',
              value: 'githubDarkTheme',
            },
            {
              label: 'vscodeTheme',
              value: 'vscodeTheme',
            },
            {
              label: 'gruvboxTheme',
              value: 'gruvboxTheme',
            },
            {
              label: 'monokaiTheme',
              value: 'monokaiTheme',
            },
            {
              label: 'basicTheme',
              value: 'basicTheme',
            },
          ]}
        />
      </Space>
      <div style={{ width: '100%', overflowY: 'auto', height: '80%' }}>
        {input ? error ? <Result status={'error'} title={error} /> : <JsonView {...props} ref={ref} /> : undefined}
      </div>
    </Flex>
  );
};

const textareaStyle: CSSProperties = {
  width: '80vh',
  height: '88vh',
  marginLeft: '10px',
};

const JsonFormatter: FC = () => {
  const [input, setInput] = useState('');
  return (
    <Flex gap={'large'} align={'center'} justify={'space-around'}>
      <TextArea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        styles={{
          textarea: textareaStyle,
        }}
      />
      <div style={{ height: textareaStyle.height, width: textareaStyle.width }}>
        <Viewer input={input} />
      </div>
    </Flex>
  );
}

const JsonZipper: FC = () => {
  const [input, setInput] = useState('');
  const { message } = App.useApp();
  const onZip = () => {
    setInput(input.replace(/[\n\t\r\s]/g, ''));
  }
  const onCopy = async () => {
    await copyToClipboard(input);
    message.success('copied');
  }
  return (
    <Flex gap={'large'} align={'center'} justify={'space-between'}>
      <TextArea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        styles={{
          textarea: textareaStyle,
        }}
      />
      <Flex gap={'large'} align={'center'} justify={'center'} style={{width: textareaStyle.width}}>
        <Button type={'primary'} size={'large'} onClick={onZip}>压缩</Button>
        <Button type={'primary'} size={'large'} onClick={onCopy}>copy</Button>
      </Flex>
    </Flex>
  )
}

const tabs: Array<CardTab> = [
  {
    key: 'formatter',
    label: '格式化',
    content: <JsonFormatter />,
  },
  {
    key: 'zipper',
    label: '压缩',
    content: <JsonZipper />,
  },
];

const Json: FC = () => {
  const [tab, setTab] = useState(tabs[0].key);
  return (
    <Card
      tabList={tabs}
      activeTabKey={tab}
      onTabChange={(key) => {
        setTab(key);
      }}
    >
      {getTabContent(tabs, tab)}
    </Card>
  );
};

export default Json;
