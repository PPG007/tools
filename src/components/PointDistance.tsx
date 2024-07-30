import { Affix, Button, Flex, Form, InputNumber, Space, Table, TableColumnsType, Tag } from 'antd';
import { CSSProperties, FC, useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getArrayByLength, getPointDistance, PointCoordinates } from '../utils';
import { v4 } from 'uuid';

interface PointPairProps {
  keyNumber: number;
  removeFunc?: (key: number) => void;
  coordinates?: PointCoordinates;
  onCoordinatesChange?: (value: PointCoordinates) => void;
}

const PointPair: FC<PointPairProps> = ({
                                         keyNumber,
                                         removeFunc,
                                         coordinates = {lng: 0, lat: 0},
                                         onCoordinatesChange,
                                       }) => {
  return (
    <>
      <Space
        align={'baseline'}
        key={keyNumber}
        style={{display: 'flex'}}
        size={'middle'}
      >
        <Tag>{keyNumber}</Tag>
        <Form.Item label={'经度'}>
          <InputNumber
            value={coordinates.lng}
            controls={false} style={{width: '250px'}}

            onChange={(value) => {
              if (value && onCoordinatesChange) {
                onCoordinatesChange({
                  ...coordinates,
                  lng: value,
                });
              }
            }}
          />
        </Form.Item>
        <Form.Item label={'纬度'}>
          <InputNumber
            value={coordinates.lat}
            controls={false}
            style={{width: '250px'}}
            onChange={(value) => {
              if (value && onCoordinatesChange) {
                onCoordinatesChange({
                  ...coordinates,
                  lat: value,
                });
              }
            }}
          />
        </Form.Item>
        {
          removeFunc ? <MinusCircleOutlined onClick={() => {
            removeFunc(keyNumber);
          }}/> : undefined
        }
      </Space>
    </>
  );
};

interface distance {
  from: number;
  to: number;
  distance: number;
}

const calculateDistance = (points: Array<PointCoordinates>): Array<distance> => {
  const result: Array<distance> = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const distance = getPointDistance(points[i], points[j]);
      result.push({
        from: i,
        to: j,
        distance: distance,
      });
    }
  }
  return result;
};

const DistanceResult: FC<{ result: Array<distance> }> = ({result}) => {
  const fromList: Array<number> = [];
  const toList: Array<number> = [];
  result.forEach((item) => {
    if (!fromList.includes(item.from)) {
      fromList.push(item.from);
    }
    if (!toList.includes(item.to)) {
      toList.push(item.to);
    }
  });
  const columns: TableColumnsType<distance> = [
    {
      title: '起点',
      dataIndex: 'from',
      width: '%30',
      filters: fromList.map((from) => ({text: `${from}`, value: from})),
      filterSearch: true,
      onFilter: (value, item) => (item.from === value)
    },
    {
      title: '终点',
      dataIndex: 'to',
      width: '30%',
      filters: toList.map((to) => ({text: `${to}`, value: to})),
      filterSearch: true,
      onFilter: (value, item) => (item.to === value)
    },
    {
      title: '直线距离（米）',
      dataIndex: 'distance',
      sorter: (a, b) => (a.distance - b.distance),
      showSorterTooltip: false,
      width: '40%',
    }
  ];
  return (
    <Table
      columns={columns}
      pagination={false}
      scroll={{y: style.height}}
      dataSource={result.map((item) => {
        return {
          ...item,
          key: v4(),
        };
      })}
    />
  );
};

const style: CSSProperties = {
  width: '80vh',
  height: '88vh',
  marginTop: '30px',
};

const PointDistance: FC = () => {
  const fixedLength = 2;
  const [points, setPoints] = useState<Array<PointCoordinates>>(() => {
    const initialValue: Array<PointCoordinates> = [];
    for (let i = 0; i < fixedLength; i++) {
      initialValue.push({
        lng: 0,
        lat: 0,
      });
    }
    return initialValue;
  });
  const [distanceResult, setDistanceResult] = useState<Array<distance>>([]);
  useEffect(() => {
    setDistanceResult(calculateDistance(points));
  }, [points]);
  const onCoordinatesChange = (index: number) => (value: PointCoordinates) => {
    setPoints(points.map((point, i) => {
      if (index === i) {
        return value;
      }
      return point;
    }));
  };
  return (
    <Flex
      gap={'large'}
      align={'center'}
      justify={'space-around'}
    >
      <Form
        style={{
          ...style,
          overflowY: 'auto',
        }}
      >
        <Form.List name={'points'}>
          {
            (fields, {add, remove}) => {
              return (
                <>
                  {
                    getArrayByLength(fixedLength).map((_, index) => (
                      <PointPair
                        key={index}
                        keyNumber={index}
                        coordinates={points[index]}
                        onCoordinatesChange={onCoordinatesChange(index)}
                      />
                    ))
                  }
                  {
                    fields.map((_key, index) => (
                      <PointPair
                        key={index + fixedLength}
                        keyNumber={index + fixedLength}
                        coordinates={points[index + fixedLength]}
                        onCoordinatesChange={onCoordinatesChange(index + fixedLength)}
                        removeFunc={() => {
                          setPoints(points.filter((_, i) => (i !== index + fixedLength)));
                          remove(index);
                        }}
                      />
                    ))
                  }
                  <Form.Item>
                    <Affix offsetBottom={100}>
                      <Button
                        type={'primary'}
                        icon={<PlusOutlined/>}
                        onClick={() => {
                          setPoints(points.concat({
                            lng: 0,
                            lat: 0,
                          }));
                          add();
                        }}
                      >
                        添加坐标点
                      </Button>
                    </Affix>
                  </Form.Item>
                </>
              );
            }
          }
        </Form.List>
      </Form>
      <div style={style}>
        <DistanceResult result={distanceResult}/>
      </div>
    </Flex>
  );
};

export default PointDistance;