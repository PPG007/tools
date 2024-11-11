import { FC, useState } from 'react';
import {
  Button,
  Divider,
  Drawer,
  Flex,
  Form,
  InputNumber,
  Space,
  Tag,
  Timeline,
  TimelineItemProps,
  Tooltip
} from 'antd';
import { round } from '../utils';
import { AccountBookOutlined, MinusCircleOutlined } from '@ant-design/icons';

interface TaxRate {
  minAmount: number;
  maxAmount: number;
  rate: number;
  quickNumber: number;
}

const yearTaxRateTable: Array<TaxRate> = [
  {
    minAmount: 0,
    maxAmount: 36000,
    rate: 3,
    quickNumber: 0,
  },
  {
    minAmount: 36001,
    maxAmount: 144000,
    rate: 10,
    quickNumber: 2520,
  },
  {
    minAmount: 144001,
    maxAmount: 300000,
    rate: 20,
    quickNumber: 16920,
  },
  {
    minAmount: 300001,
    maxAmount: 420000,
    rate: 25,
    quickNumber: 31920,
  },
  {
    minAmount: 420001,
    maxAmount: 660000,
    rate: 30,
    quickNumber: 52920,
  },
  {
    minAmount: 660001,
    maxAmount: 960000,
    rate: 35,
    quickNumber: 85920,
  },
  {
    minAmount: 960000,
    maxAmount: 0,
    rate: 45,
    quickNumber: 181920,
  },
];

const taxFreeAmount = 5000;

interface Income {
  income: number;
  deductionAmount: number;
}

const calculate = (incomeList: Array<Income>, fixedDeductionAmount: number): Array<TimelineItemProps> => {
  const items: Array<TimelineItemProps> = [];
  let total = 0;
  let tax = 0;
  incomeList.forEach((item, index) => {
    const amount = item.income - taxFreeAmount - item.deductionAmount - fixedDeductionAmount;
    total = round(amount + total);
    const rate = yearTaxRateTable.find((rate) => {
      return rate.minAmount <= total && rate.maxAmount >= total || rate.minAmount <= total && rate.maxAmount === 0;
    });
    if (!rate) {
      return;
    }
    const totalTax = round(total * rate.rate * 0.01 - rate.quickNumber);
    const currentTax = round(totalTax - tax);
    const paidTax = tax;
    tax = round(tax + currentTax);
    items.push({
      children: (
        <>
          {
            index > 0 ? <Divider/> : undefined
          }
          <h3>{`第${index + 1}个月`}</h3>
          <p>
            <strong>本月应纳税所得额：</strong>
            税前总收入 - 起征点 - 专项扣除 - 专项附加扣除
            = {item.income} - {taxFreeAmount} - {item.deductionAmount} - {fixedDeductionAmount} = {amount}元
          </p>
          <p>
            <strong>累计应纳税所得额：</strong>{total}元
          </p>
          <p>
            <strong>适用税率：</strong>{rate.rate}%
          </p>
          <p>
            <strong>速算扣除数：</strong>{rate.quickNumber}
          </p>
          <p>
            <strong>应缴税额：</strong>{`${total} * ${rate.rate}% - ${rate.quickNumber} = ${totalTax}元`}
          </p>
          <p>
            <strong>已缴税额：</strong>{paidTax}元
          </p>
          <p>
            <strong>当月应缴税额：</strong>{totalTax} - {paidTax} = {currentTax}元
          </p>
        </>
      ),
    });
  });
  items.push({
    children: (
      <>
        <h2>累计应缴税额</h2>
        <strong>{tax}元</strong>
      </>
    ),
    dot: <AccountBookOutlined/>
  });
  return items;
};

const IncomeLine: FC<{
  keyNumber: number,
  income: Income,
  setIncome: (income: Income) => void,
  remove?: () => void,
}> = ({
        income,
        setIncome,
        keyNumber,
        remove,
      }) => {
  return (
    <Space
      align={'baseline'}
      style={{display: 'flex'}}
      size={'middle'}
      key={keyNumber}
    >
      <Tag>{keyNumber + 1}月</Tag>
      <Form.Item label={'税前收入'}>
        <InputNumber
          controls={false}
          precision={2}
          min={0}
          value={income.income}
          onChange={(v) => {
            setIncome({
              ...income,
              income: v || 0,
            });
          }}
        />
      </Form.Item>
      <Form.Item label={'五险一金等专项扣除'}>
        <InputNumber
          precision={2}
          controls={false}
          min={0}
          value={income.deductionAmount}
          onChange={(v) => {
            setIncome({
              ...income,
              deductionAmount: v || 0,
            });
          }}
        />
      </Form.Item>
      {
        remove ? <MinusCircleOutlined onClick={() => {
          remove();
        }}/> : undefined
      }
    </Space>
  );
};

const Tax: FC = () => {
  const [fixedDeductAmount, setFixedDeductAmount] = useState(0);
  const [incomeList, setIncomeList] = useState<Array<Income>>([{income: 0, deductionAmount: 0}]);
  const [isResultShowing, setIsResultShowing] = useState(false);
  return (
    <Flex
      gap={'large'}
      align={'center'}
      justify={'space-around'}
    >
      <Form
        style={{
          marginTop: '60px'
        }}
      >
        <Form.Item label={'专项附加扣除'}>
          <InputNumber
            value={fixedDeductAmount}
            controls={false}
            onChange={(v) => {
              if (v) {
                setFixedDeductAmount(round(v));
                return;
              }
              setFixedDeductAmount(0);
            }}
            precision={2}
            min={0}
          />
        </Form.Item>
        <Form.List name={'income'}>
          {
            (fields, {add, remove}) => (
              <>
                <Form.Item>
                  <Space
                    size={'large'}
                    align={'center'}
                  >
                    <Tooltip
                      title={'新建行的内容将与最后一行相同'}
                      placement={'left'}
                    >
                      <Button
                        type={'primary'}
                        onClick={() => {
                          let income: Income = {
                            income: 0,
                            deductionAmount: 0,
                          };
                          if (incomeList.length) {
                            income = incomeList[incomeList.length - 1];
                          }
                          setIncomeList(incomeList.concat(income));
                          add();
                        }}
                        disabled={incomeList.length >= 12}
                        size={'large'}
                      >
                        添加一行
                      </Button>
                    </Tooltip>
                    <Button
                      type={'primary'}
                      onClick={() => {
                        setIsResultShowing(true);
                      }}
                      size={'large'}
                    >
                      计算
                    </Button>
                  </Space>
                </Form.Item>
                {
                  <IncomeLine
                    keyNumber={0}
                    income={incomeList[0]}
                    setIncome={(income) => {
                      incomeList[0] = income;
                      setIncomeList([...incomeList]);
                    }}
                  />
                }
                {
                  fields.map((_, index) => (
                    <IncomeLine
                      income={incomeList[index + 1]}
                      setIncome={(income) => {
                        incomeList[index + 1] = income;
                        setIncomeList([...incomeList]);
                      }}
                      keyNumber={index + 1}
                      key={index + 1}
                      remove={() => {
                        setIncomeList(incomeList.filter((_, i) => i !== index + 1));
                        remove(index);
                      }}
                    />
                  ))
                }
              </>
            )
          }
        </Form.List>
      </Form>
      <Drawer
        title={'计算结果'}
        onClose={() => {
          setIsResultShowing(false);
        }}
        open={isResultShowing}
        size={'large'}
      >
        <Timeline items={calculate(incomeList, fixedDeductAmount)}/>
      </Drawer>
    </Flex>
  );
};

export default Tax;