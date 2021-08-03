import React, { useState, useContext, useEffect } from 'react';
import { Button, message, Tooltip } from 'antd';
import { MobileOutlined, LaptopOutlined, EyeOutlined } from '@ant-design/icons';
import { Context } from '@/pages/setting/model';
import SourceCodeDrawer from '../codeEditor/SourceCodeDrawer';
import styles from './index.less';

const Header = () => {
  const appContext: any = useContext(Context);
  const [visible, setVisible] = useState(false);
  const [codeList, setCodeList] = useState([]);
  useEffect(() => {
    const { sourceCode, apiCode, styleCode, codeType } = appContext.state;
    let list: any = [];
    switch (codeType) {
      case 'vue2':
        list = [
          { fileName: 'index.vue', fileCode: sourceCode },
          { fileName: 'api/index.js', fileCode: apiCode },
        ];
        break;
      case 'vue3':
        list = [
          { fileName: 'index.vue', fileCode: sourceCode },
          { fileName: 'api/index.js', fileCode: apiCode },
        ];
        break;
      case 'react':
        list = [
          { fileName: 'index.js', fileCode: sourceCode },
          { fileName: 'api/index.js', fileCode: apiCode },
          { fileName: 'index.less', fileCode: styleCode },
        ];
        break;
    }
    if (sourceCode) {
      setCodeList(list);
      setVisible(true);
    }
  }, [appContext.state.showSourceCode]);

  const handleGenerate = (type = 'vue2') => {
    if (!['react', 'vue2', 'vue3'].includes(type)) return;
    appContext.dispatch({
      type: `generate/${type}`,
      data: {},
    });
    gtag('event', 'handleGenerate', {
      event_category: 'Header',
      event_label: `生成${type}源码`,
      value: 1,
    });
  };

  const handleCodeCB = (obj: any) => {
    const { visible } = obj;
    setVisible(visible);
  };

  const handleMobile = () => {
    message.warn('功能尚在开发中……');
    gtag('event', 'handleMobile', {
      event_category: 'Header',
      event_action: '点击切换',
      event_label: '移动端',
      value: 1,
    });
  };
  const handleLaptop = () => {
    message.warn('功能尚在开发中……');
    gtag('event', 'handleLaptop', {
      event_category: 'Header',
      event_action: '点击切换',
      event_label: 'pc',
      value: 1,
    });
  };
  const handleView = () => {
    message.warn('功能尚在开发中……');
    gtag('event', 'handleView', {
      event_category: 'Header',
      event_label: '预览',
      value: 1,
    });
  };

  return (
    <div className={styles['c-header']}>
      <div className={styles['h-left']}>
        <img
          alt="logo"
          src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        />
        <div className={styles['title']}>idou</div>
      </div>
      <div className={styles['h-center']}>
        <Button
          type="link"
          icon={<MobileOutlined />}
          onClick={() => handleMobile()}
        ></Button>
        <Button
          type="link"
          icon={<LaptopOutlined />}
          onClick={() => handleLaptop()}
        ></Button>
      </div>
      <div className={styles['h-right']}>
        <Tooltip title="预览">
          <Button
            id={'btn-view'}
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView()}
          ></Button>
        </Tooltip>
        <Button
          type="primary"
          id={'btn-generate-code-vue2'}
          onClick={() => handleGenerate('vue2')}
        >
          生成vue2源码
        </Button>
        <Button
          type="primary"
          id={'btn-generate-code-vue3'}
          onClick={() => handleGenerate('vue3')}
        >
          生成vue3源码
        </Button>
        <Button
          type="primary"
          id={'btn-generate-code-react'}
          onClick={() => handleGenerate('react')}
        >
          生成react源码
        </Button>
        <SourceCodeDrawer
          valueList={codeList}
          visible={visible}
          type={'vue'}
          handleCB={(val: any) => handleCodeCB(val)}
        />
      </div>
    </div>
  );
};

export default Header;
