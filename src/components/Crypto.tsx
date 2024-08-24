import { CSSProperties, FC, useState } from 'react';
import { enc, HmacMD5, HmacSHA1, HmacSHA256, HmacSHA512, MD5, SHA1, SHA256, SHA512 } from 'crypto-js';
import { Flex, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';

enum Method {
  Sha1 = 'sha1',
  Sha256 = 'sha256',
  Sha512 = 'sha512',
  Md5 = 'md5',
}

const methodFromString = (str: string) => {
  if (Object.values(Method).includes(str as Method)) {
    return str as Method;
  }
  return Method.Md5;
};

interface Calculator {
  calculate(src: string, key: string): string;
}

const toString = enc.Hex.stringify;
const md5: Calculator = {
  calculate(src: string, key: string): string {
    if (key) {
      return toString(HmacMD5(src, key));
    }
    return toString(MD5(src));
  }
};
const sha1: Calculator = {
  calculate(src: string, key: string): string {
    if (key) {
      return toString(HmacSHA1(src, key));
    }
    return toString(SHA1(src));
  }
};
const sha256: Calculator = {
  calculate(src: string, key: string): string {
    if (key) {
      return toString(HmacSHA256(src, key));
    }
    return toString(SHA256(src));
  }
};
const sha512: Calculator = {
  calculate(src: string, key: string): string {
    if (key) {
      return toString(HmacSHA512(src, key));
    }
    return toString(SHA512(src));
  }
};
const getCalculator = (method: Method): Calculator => {
  switch (method) {
    case Method.Sha1:
      return sha1;
    case Method.Sha256:
      return sha256;
    case Method.Sha512:
      return sha512;
  }
  return md5;
};

const areaStyle: CSSProperties = {
  resize: 'none',
  height: '30%'
};
const Crypto: FC = () => {
  const [key, setKey] = useState('');
  const [src, setSrc] = useState('');
  const [method, setMethod] = useState<Method>(Method.Md5);
  const result = src ? getCalculator(method).calculate(src, key) : '';
  return (
    <Flex gap={'large'} align={'center'} justify={'center'} vertical style={{height: '100%'}}>
      <TextArea
        placeholder={'source string'}
        style={areaStyle}
        value={src}
        onChange={(e) => {
          setSrc(e.target.value);
        }}
      />
      <TextArea
        placeholder={'key(optional)'}
        style={areaStyle}
        value={key}
        onChange={(e) => {
          setKey(e.target.value);
        }}
      />
      <Select
        style={{width: 'auto'}}
        defaultValue={'md5'}
        options={[
          {value: 'md5', label: 'md5'},
          {value: 'sha1', label: 'sha1'},
          {value: 'sha256', label: 'sha256'},
          {value: 'sha512', label: 'sha512'},
        ]}
        onChange={(value) => {
          setMethod(methodFromString(value));
        }}
      />
      <TextArea value={result} readOnly style={areaStyle}/>
    </Flex>
  );
};

export default Crypto;