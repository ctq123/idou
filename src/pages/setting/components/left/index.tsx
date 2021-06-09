import React, { useState, useContext, useEffect } from 'react';
import { Button, Tabs, Drawer } from 'antd';
import { templates, tabs } from '../../const';
import { Context } from '@/pages/setting/model';
import { componentList } from '../../const/componentDSL';
import CodeDrawer from '../codeEditor/CodeDrawer';
import Setting from './Setting';
import { prettierFormat } from '@/utils';
import styles from './index.less';

const { TabPane } = Tabs;

const Left = () => {
  const [tab, setTab] = useState('template');
  const [selectedComponent, setSelectedComponent]: any = useState(null);
  const [showCode, setShowCode]: any = useState(false);
  const appContext: any = useContext(Context);
  useEffect(() => {
    setSelectedComponent(appContext.state.selectedComponent);
    if (appContext.state.selectedComponent) {
      setTab('setting');
    }
  }, [appContext.state.selectedComponent]);

  const handleSettingCB = (com: any) => {
    const { from } = selectedComponent;
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

  const handleApisCodeCB = (codeStr: any) => {
    console.log('codeStr', codeStr);
  };

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
        return (
          <div className={styles['component']}>
            {(componentList || []).map((item, i) => (
              <div key={i} className={styles['item']}>
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
            component={component}
            handleCB={(com: any) => handleSettingCB(com)}
          />
        );
      case 'request':
        const { apis = {} } = appContext.state.dsl;
        let codeStr = Object.keys(apis).reduce((pre, cur): any => {
          let str = '';
          if (cur === 'imports') {
            str = Object.entries(apis.imports)
              .map(([k, v]) => `import ${k} from "${v}";`)
              .join('\n');
          } else {
            str = `export ${apis[cur]}`;
          }
          return pre + str + '\n';
        }, '');
        codeStr = prettierFormat(codeStr, 'babel');
        console.log(codeStr);
        return (
          <>
            <Button type="primary" onClick={() => setShowCode(true)}>
              编辑
            </Button>
            <CodeDrawer
              value={codeStr}
              visible={showCode}
              type={'function'}
              handleCB={(val: any) => handleApisCodeCB(val)}
            />
          </>
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
            <TabPane tab={item.label} key={item.code}>
              {generateTabPane()}
            </TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Left;
