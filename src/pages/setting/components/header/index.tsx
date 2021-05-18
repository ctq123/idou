import React, { useState, useContext, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { MobileOutlined, LaptopOutlined, EyeOutlined } from '@ant-design/icons';
import { Context } from '@/pages/setting/model';
import CodeDrawer from '../codeEditor/CodeDrawer';
import { deserialize } from '@/utils';
import styles from './index.less';

const Header = () => {
  const appContext: any = useContext(Context);
  const [visible, setVisible] = useState(false);
  const [sourceCode, setSourceCode] = useState(null);
  useEffect(() => {
    const { vueCode } = appContext.state;
    if (vueCode) {
      setSourceCode(vueCode);
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
        <Tooltip title="预览">
          <Button type="link" icon={<EyeOutlined />}></Button>
        </Tooltip>
        <Button type="primary" onClick={() => handleGenerate()}>
          生成源码
        </Button>
        <CodeDrawer
          value={sourceCode}
          visible={visible}
          type="vue"
          handleCB={(val: any) => handleCodeCB(val)}
        />
      </div>
    </div>
  );
};

export default Header;
