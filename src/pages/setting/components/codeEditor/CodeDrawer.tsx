import React, { useEffect, useState } from 'react';
import { Button, Drawer, Tooltip } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import CodeEditor from './index';
import styles from './CodeDrawer.less';

interface IProps {
  value: any;
  visible: boolean;
  type?: 'component' | 'function' | 'vue';
  handleCB?: any;
}

const CodeDrawer = (props: IProps) => {
  const { handleCB, type = 'component' } = props;
  const codeRef: any = React.useRef(null);

  const onClose = () => {
    handleCB && handleCB({ visible: false });
  };

  const handleSave = () => {
    const code = codeRef.current.getEditorValue();
    console.log('code', code);
    if (code) {
      handleCB && handleCB({ visible: false, code });
    }
  };
  const titleNode = () => (
    <div className={styles['title-con']}>
      <div className={styles['title']}>{'代码编辑'}</div>
      <div>
        <Tooltip title="保存">
          <Button
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
