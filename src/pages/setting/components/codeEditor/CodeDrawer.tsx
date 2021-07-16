import React, { useEffect, useState } from 'react';
import { Button, Drawer, Tooltip } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import CodeEditor from './index';
import styles from './CodeDrawer.less';

interface IProps {
  value: any;
  visible: boolean;
  type?: 'component' | 'function' | 'html';
  handleCB?: any;
}

const CodeDrawer = (props: IProps) => {
  const { handleCB, type = 'component' } = props;
  const codeRef: any = React.useRef(null);

  const onClose = () => {
    handleCB && handleCB({ visible: false });
    gtag('event', 'onClose', {
      event_category: 'CodeDrawer',
      event_label: '关闭',
      value: 1,
    });
  };

  const handleSave = () => {
    const code = codeRef.current.getEditorValue();
    console.log('code', code);
    handleCB && handleCB({ visible: false, code });
    gtag('event', 'handleSave', {
      event_category: 'CodeDrawer',
      event_label: '保存',
      value: 1,
    });
  };
  const titleNode = () => (
    <div className={styles['title-con']}>
      <div className={styles['title']}>{'代码编辑'}</div>
      <div>
        <Tooltip title="保存">
          <Button
            id={'btn-code-drawer-save'}
            type="link"
            icon={<SaveOutlined />}
            onClick={() => handleSave()}
          ></Button>
        </Tooltip>
      </div>
    </div>
  );
  return (
    <Drawer
      title={titleNode()}
      placement={'left'}
      closable={false}
      onClose={onClose}
      visible={props.visible}
      width={800}
      bodyStyle={{ overflow: 'hidden' }}
      headerStyle={{ padding: 8 }}
    >
      <CodeEditor
        value={props.value}
        type={type}
        ref={(ref: any) => (codeRef.current = ref)}
      />
    </Drawer>
  );
};

export default CodeDrawer;
