import { CardTabListType } from 'antd/es/card';
import { ReactNode } from 'react';

export interface CardTab extends CardTabListType {
  content?: ReactNode;
}

export const getTabContent = (tabs: Array<CardTab>, key: string) => {
  const tab =  tabs.find((tab) => tab.key === key);
  if (!tab) {
    return undefined;
  }
  return tab.content;
}