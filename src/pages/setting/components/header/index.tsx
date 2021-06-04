import React, { useState, useContext, useEffect } from 'react';
import { Button, message, Tooltip } from 'antd';
import { MobileOutlined, LaptopOutlined, EyeOutlined } from '@ant-design/icons';
import { Context } from '@/pages/setting/model';
import SourceCodeDrawer from '../codeEditor/SourceCodeDrawer';
import { deserialize } from '@/utils';
import styles from './index.less';

const Header = () => {
  const appContext: any = useContext(Context);
  const [visible, setVisible] = useState(false);
  const [codeList, setCodeList] = useState([]);
  useEffect(() => {
    const { vueCode, apiCode } = appContext.state;
    const list: any = [
      { fileName: 'index.vue', fileCode: vueCode },
      { fileName: 'api/index.js', fileCode: apiCode },
    ];
    if (vueCode) {
      setCodeList(list);
      setVisible(true);
    }
  }, [appContext.state.showVueCode]);

  const handleGenerate = () => {
    appContext.dispatch({
      type: 'generate/vue',
      data: {},
    });
  };

  const handleCodeCB = (obj: any) => {
    const { visible } = obj;
    setVisible(visible);
  };

  const handleMobile = () => {
    message.warn('功能尚在开发中……');
  };

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
        <Button
          type="link"
          icon={<MobileOutlined />}
          onClick={() => handleMobile()}
        ></Button>
        <Button
          type="link"
          icon={<LaptopOutlined />}
          onClick={() => handleMobile()}
        ></Button>
      </div>
      <div className={styles['h-right']}>
        <Tooltip title="预览">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleMobile()}
          ></Button>
        </Tooltip>
        <Button type="primary" onClick={() => handleGenerate()}>
          生成源码
        </Button>
        <SourceCodeDrawer
          valueList={codeList}
          visible={visible}
          type="vue"
          handleCB={(val: any) => handleCodeCB(val)}
        />
      </div>
    </div>
  );
};

export default Header;
