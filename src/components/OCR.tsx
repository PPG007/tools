import { FC, useEffect, useRef, useState } from 'react';
import { Button, Flex, Image, Result, Space, Spin, Upload } from 'antd';
import { createWorker, Worker } from 'tesseract.js';
import { defaultImage } from '../utils';
import TextArea from 'antd/es/input/TextArea';
import { UploadOutlined } from '@ant-design/icons';

interface Image {
  blob: Blob;
  url: string;
}

const readImageFromClipboard = async (): Promise<Image | undefined> => {
  const items = await navigator.clipboard.read();
  for (const item of items) {
    if (item.types.length && item.types[0].startsWith('image')) {
      const blob = await item.getType(item.types[0]);
      const url = URL.createObjectURL(blob);
      return {
        blob,
        url,
      };
    }
  }
  return undefined;
};

const ImageUploader: FC<{ setImage?: (image: Image) => void }> = ({setImage}) => {
  return (
    <>
      <Upload
        accept={'image/jpeg,image/png'}
        maxCount={1}
        showUploadList={false}
        beforeUpload={(file) => {
          if (setImage) {
            setImage({
              blob: file,
              url: URL.createObjectURL(file),
            });
          }
          return false;
        }}
      >
        <Button
          type={'primary'}
          icon={<UploadOutlined/>}
          size={'large'}
        >
          select image from file
        </Button>
      </Upload>
    </>
  );
};

const ImageDisplayer: FC<{ image?: Image }> = ({image}) => {
  const width = '640px';
  const height = '360px';
  if (image) {
    return (<Image
      src={image?.url}
      fallback={defaultImage}
      width={width}
      height={height}
    />);
  }
  return (
    <Result
      status={'warning'}
      title={'please select image'}
      style={{
        height,
        width
      }}
    />
  );
};

const OCR: FC = () => {
  const [image, setImage] = useState<Image | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const worker = useRef<Worker>();
  useEffect(() => {
    setIsLoading(true);
    createWorker(['eng', 'chi_sim']).then((result) => {
      worker.current = result;
    }).finally(() => {
      setIsLoading(false);
    });
    return () => {
      worker.current?.terminate();
    };
  }, []);
  useEffect(() => {
    if (!image || !worker.current) {
      return;
    }
    setIsLoading(true);
    worker.current.recognize(image.blob).then(({data: {text}}) => {
      setResultText(text);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [image]);
  return (
    <Spin
      spinning={isLoading}
      size={'large'}
      style={{
        width: '80vh',
        height: '88vh',
        marginTop: '30px',
      }}
    >
      <Flex
        gap={'large'}
        align={'center'}
        justify={'center'}
        vertical
      >
        <ImageDisplayer image={image}/>
        <Space size={'large'}>
          <Button
            type={'primary'}
            onClick={async () => {
              setImage(await readImageFromClipboard());
            }}
            size={'large'}
          >
            paste from clipboard
          </Button>
          OR
          <ImageUploader setImage={setImage}/>
        </Space>
        <TextArea
          styles={{
            textarea: {
              height: '400px',
            },
          }}
          value={resultText}
          readOnly
        />
      </Flex>
    </Spin>
  );
};

export default OCR;