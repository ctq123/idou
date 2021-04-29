import React from 'react';
import { Button, Tabs } from 'antd';
import {
  MobileOutlined,
  LaptopOutlined,
  EyeOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import styles from './index.less';

const Header = () => {
  return (
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
  );
};

export default Header;
