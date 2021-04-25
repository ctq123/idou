import React, { useState } from 'react';
import { Button, Tabs } from 'antd';
import {
  MobileOutlined,
  LaptopOutlined,
  EyeOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { templates, tabs } from './const';
import styles from './index.less';

const { TabPane } = Tabs;

export default function IndexPage() {
  const [tab, setTab] = useState('template');

  const generateTabPane = () => {
    switch (tab) {
      case 'template':
        return (
          <div className={styles['template']}>
            {(templates || []).map((item, i) => (
              <div key={i} className={styles['item']}>
                <img alt="图片" src={item.img} />
                <div className={styles['title']}>{item.label}</div>
              </div>
            ))}
          </div>
        );
      case 'component':
      case 'setting':
      default:
        return '';
    }
  };

  return (
    <div className={styles['container']}>
      <div className={styles['c-header']}>
        <div className={styles['h-left']}>
          <img
            alt="logo"
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
          />
          <div className={styles['title']}>荒原</div>
        </div>
        <div className={styles['h-center']}>
          <Button type="link" icon={<MobileOutlined />}></Button>
          <Button type="link" icon={<LaptopOutlined />}></Button>
        </div>
        <div className={styles['h-right']}>
          <Button type="link" icon={<EyeOutlined />}></Button>
          <Button type="link" icon={<DownloadOutlined />}></Button>
          <Button type="primary">提交</Button>
        </div>
      </div>
      <div className={styles['c-body']}>
        <div className={styles['b-left']}>
          <Tabs defaultActiveKey={tab} onChange={(k) => setTab(k)}>
            {(tabs || []).map((item, i) => (
              <TabPane tab={item.label} key={item.code}>
                {generateTabPane()}
              </TabPane>
            ))}
          </Tabs>
        </div>
        <div className={styles['b-right']}>
          <div className={styles['content']}></div>
        </div>
      </div>
    </div>
  );
}
