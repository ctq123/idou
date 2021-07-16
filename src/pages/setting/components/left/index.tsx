import React, { useState, useContext, useEffect } from 'react';
import { Tabs, message } from 'antd';
import { templates, tabs } from '../../const';
import { Context } from '@/pages/setting/model';
import { ModuleComponents } from '../../const/componentDSL';
import Setting from './Setting';
import Request from './Request';
import styles from './index.less';

const { TabPane } = Tabs;

const Left = () => {
  const [tab, setTab] = useState('template');
  const [tmpl, setTmpl] = useState('list');
  const [selectedComponent, setSelectedComponent]: any = useState(null);
  const appContext: any = useContext(Context);
  useEffect(() => {
    setSelectedComponent(appContext.state.selectedComponent);
    if (appContext.state.selectedComponent) {
      setTab('setting');
    }
  }, [appContext.state.selectedComponent]);
  useEffect(() => {
    setTmpl(appContext.state.dslType);
  }, [appContext.state.dslType]);

  const handleSettingCB = (com: any) => {
    const { from } = selectedComponent || {};
    console.log('handleSettingCB com', com);
    if (!from) return;
    if (com) {
      appContext.dispatch({
        type: 'component/replace',
        data: {
          component: com,
          from,
        },
      });
      appContext.dispatch({
        type: 'component/selected',
        data: {
          component: com,
          from,
        },
      });
    }
  };

  const selectTemplate = (item: any) => {
    appContext.dispatch({
      type: 'dsl/type/update',
      data: {
        dslType: item.code,
      },
    });
    gtag('event', 'selectTemplate', {
      event_category: 'Left',
      event_label: `${item.label}`,
      value: 1,
    });
  };

  const handleRequestCB = (apis: any) => {
    if (apis) {
      appContext.dispatch({
        type: 'dsl/apis/update',
        data: {
          apis,
        },
      });
    }
  };

  const addComponent = (item: any) => {
    // const { index, parentUuid, item } = selectedComponent || {}
    // TODO 处理点击事件
    message.warn('功能尚在开发中……');
    gtag('event', 'addComponent', {
      event_category: 'Left',
      event_label: `${item.name}`,
      value: 1,
    });
  };

  const generateTabPane = () => {
    switch (tab) {
      case 'template':
        return (
          <div className={styles['template']}>
            {(templates || []).map((item, i) => (
              <div
                id={'tab-template-' + item.code}
                key={i}
                className={
                  tmpl === item.code
                    ? `${styles['active-item']} ${styles['item']}`
                    : styles['item']
                }
                onClick={() => selectTemplate(item)}
              >
                <img alt="图片" src={item.img} />
                <div className={styles['title']}>{item.label}</div>
              </div>
            ))}
          </div>
        );
      case 'component':
        return (
          <div className={styles['component']}>
            {(ModuleComponents || []).map((item: any, i: number) => (
              <div
                id={'tab-component-' + item.key}
                key={i}
                className={styles['item']}
                onClick={() => addComponent(item)}
              >
                <img
                  alt="图片"
                  src={
                    'https://cdn.poizon.com/node-common/c6780a17e71588e6fd40054d541969e8.png'
                  }
                />
                <div>
                  <h3>{item.key}</h3>
                  <div>{item.name}</div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'setting':
        const { component = {} } = selectedComponent || {};
        return (
          <Setting
            VueTableRenderXML={appContext.state.VueTableRenderXML}
            component={component}
            handleCB={(com: any) => handleSettingCB(com)}
          />
        );
      case 'request':
        return (
          <Request
            dsl={appContext.state.dsl}
            handleCB={(apis: any) => handleRequestCB(apis)}
          />
        );
      default:
        return '';
    }
  };

  return (
    <div className={styles['b-left']}>
      <div className={styles['resize-box']} title="左右拖动" />
      <div className={styles['content-box']}>
        <Tabs activeKey={tab} onChange={(k) => setTab(k)}>
          {(tabs || []).map((item, i) => (
            <TabPane id={'tab-' + item.code} tab={item.label} key={item.code}>
              {generateTabPane()}
            </TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Left;
