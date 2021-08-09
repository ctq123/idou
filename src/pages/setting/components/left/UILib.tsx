import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Radio, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './UILib.less';
import { UILib } from '../../const';

interface IProps {
  codeType?: any;
  prefixUI?: any;
  handleCB?: any;
}

const UILibCom = (props: IProps) => {
  const { codeType, prefixUI, handleCB } = props || {};
  const [code, setCode] = useState(codeType);
  const [UI, setUI] = useState(prefixUI);

  const handleIconClick = (item: any) => {
    if (item && item.libUrl) {
      window.open(item.libUrl);
    }
  };

  const handleCode = (e: any) => {
    const val = e.target.value;
    setCode(val);
    if (Array.isArray(UILib[val]) && UILib[val].length) {
      const item = val === 'vue3' ? UILib[val][1] : UILib[val][0];
      setUI(item.prefixUI);
    }
  };

  const addUI = () => {
    message.warn('功能尚在开发中……');
    // TODO
  };

  const onsubmit = () => {
    if (!code || !(UI === '' || UI)) {
      message.error('请选择有效值');
      return;
    }
    handleCB && handleCB({ codeType: code, prefixUI: UI });
  };

  return (
    <div className={styles['form-container']}>
      <div className={styles['item']}>
        <div className={styles['label']}>源码:</div>
        <Radio.Group size="middle" value={code} onChange={handleCode}>
          {Object.keys(UILib).map((k) => (
            <Radio.Button key={k} value={k}>
              {k}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      <div className={styles['item']}>
        <div className={styles['label']}>UI库:</div>
        {(UILib[code] || []).map((item: any, i: number) => (
          <div
            key={i}
            className={
              item.prefixUI === UI
                ? `${styles['ui']} ${styles['active-ui']}`
                : `${styles['ui']}`
            }
            onClick={() => setUI(item.prefixUI)}
          >
            <img src={item.iconUrl} onClick={() => handleIconClick(item)} />
            <span>{item.name}</span>
          </div>
        ))}
        <div
          className={`${styles['ui']} ${styles['icon-con']}`}
          onClick={() => addUI()}
        >
          <PlusOutlined />
        </div>
      </div>

      <Button type="primary" disabled size="small" onClick={onsubmit}>
        提交
      </Button>
    </div>
  );
};

export default UILibCom;
