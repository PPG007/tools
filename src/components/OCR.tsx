import { FC, useEffect, useState } from 'react';
import { Button, Flex, Image, Modal, Result, Space, Spin, Switch, Transfer, Upload } from 'antd';
import { recognize } from 'tesseract.js';
import { defaultImage } from '../utils';
import TextArea from 'antd/es/input/TextArea';
import { UploadOutlined } from '@ant-design/icons';

interface Image {
  blob: Blob;
  url: string;
}

const supportedLanguages: {
  [key: string]: string;
} = {
  eng: '英语',
  chi_sim: '简体中文',
  chi_tra: '繁体中文',
  jpn: '日语',
};

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
          从文件中选择图片
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
      title={'选择一张图片以识别'}
      style={{
        height,
        width
      }}
    />
  );
};

const LanguageSelector: FC<{
  languages: Array<string>;
  setLanguages: (languages: Array<string>) => void;
  show: boolean;
  onModalClose: () => void;
}> = ({languages, setLanguages, show, onModalClose}) => {
  const [selectedLanguages, setSelectedLanguages] = useState(languages);
  return (
    <Modal
      open={show}
      onOk={() => {
        setLanguages(selectedLanguages);
        onModalClose();
      }}
      onCancel={() => {
        setSelectedLanguages(languages);
        onModalClose();
      }}
    >
      <Transfer
        dataSource={Object.keys(supportedLanguages).map((language) => {
          const languageName = supportedLanguages[language];
          return {
            key: language,
            title: languageName,
          };
        })}
        titles={['可选语言', '已选语言']}
        showSelectAll={false}
        render={(item) => (item.title)}
        targetKeys={selectedLanguages}
        onChange={(target) => {
          setSelectedLanguages(target);
        }}
      />
    </Modal>
  );
};

const OCR: FC = () => {
  const [image, setImage] = useState<Image | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [isModalShowing, setIsModalShowing] = useState(false);
  const [languages, setLanguages] = useState<Array<string>>(() => {
    return ['eng'];
  });
  const [isRecognizeAuto, setIsRecognizeAuto] = useState(true);
  useEffect(() => {
    if (!image || !languages.length || !isRecognizeAuto) {
      return;
    }
    setIsLoading(true);
    recognize(image.blob, languages.join('+')).then(({data: {text}}) => {
      setResultText(text);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [image, languages, isRecognizeAuto]);
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
        <LanguageSelector
          languages={languages}
          setLanguages={setLanguages}
          show={isModalShowing}
          onModalClose={() => {
            setIsModalShowing(false);
          }}
        />
        <Space size={'large'}>
          <Button
            type={'primary'}
            onClick={async () => {
              setImage(await readImageFromClipboard());
            }}
            size={'large'}
          >
            从剪切板读取图片
          </Button>
          或
          <ImageUploader setImage={setImage}/>
          <Button
            type={'dashed'}
            size={'large'}
            onClick={() => {
              setIsModalShowing(true);
            }}
          >
            选择目标语言，当前为 {languages.map((language) => (supportedLanguages[language])).join('、')}
          </Button>
          <Switch
            checked={isRecognizeAuto}
            onChange={(b) => {
              setIsRecognizeAuto(b);
            }}
            checkedChildren={'自动识别'}
          />
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