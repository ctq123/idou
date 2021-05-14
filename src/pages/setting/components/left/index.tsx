import React, { useState, useContext, useEffect } from 'react';
import { Button, Tabs, Drawer } from 'antd';
import {
  MobileOutlined,
  LaptopOutlined,
  EyeOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { templates, tabs } from '../../const';
import { Context } from '@/pages/setting/model';
import Setting from './Setting';
import styles from './index.less';

const { TabPane } = Tabs;

const Left = () => {
  const [tab, setTab] = useState('template');
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [deawerVisible, setDeawerVisible] = useState(false);
  const appContext: any = useContext(Context);
  console.log('Left state', appContext.state);
  useEffect(() => {
    setSelectedComponent(appContext.state.selectedComponent);
    if (appContext.state.selectedComponent) {
      setTab('setting');
      setDeawerVisible(true);
    }
  }, [appContext.state.selectedComponent]);

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
      <div className={styles['resize-box']} />
      <div className={styles['content-box']}>
        <Tabs defaultActiveKey={tab} onChange={(k) => setTab(k)}>
          {(tabs || []).map((item, i) => (
            <TabPane tab={item.label} key={item.code}>
              {generateTabPane()}
            </TabPane>
          ))}
        </Tabs>
        <Drawer
          title="Basic Drawer"
          placement={'left'}
          closable={false}
          onClose={() => setDeawerVisible(false)}
          visible={false}
          key={'left'}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
      </div>
    </div>
  );
};

export default Left;
