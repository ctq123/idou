import React, { useState, useReducer, useEffect } from 'react';
import { Button, Tabs } from 'antd';
import {
  MobileOutlined,
  LaptopOutlined,
  EyeOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { templates, tabs } from '../../const';
import { reducer, initState } from '@/pages/setting/model';
import Setting from './Setting';
import styles from './index.less';

const { TabPane } = Tabs;

const Left = () => {
  const [state, dispatch] = useReducer(reducer, initState);
  const [tab, setTab] = useState('template');
  const [selectedComponent, setSelectedComponent] = useState(null);
  useEffect(() => {
    setSelectedComponent(state.selectedComponent);
    if (state.selectedComponent) {
      setTab('setting');
    }
  }, [state.selectedComponent]);

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
        const { component = {} } = selectedComponent || {};
        return <Setting component={component} />;
      default:
        return '';
    }
  };

  return (
    <div className={styles['b-left']}>
      <Tabs defaultActiveKey={tab} onChange={(k) => setTab(k)}>
        {(tabs || []).map((item, i) => (
          <TabPane tab={item.label} key={item.code}>
            {generateTabPane()}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default Left;
