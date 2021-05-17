import React, { useEffect, useState } from 'react';
import { Button, Drawer, Tooltip } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import CodeEditor from './index';
import styles from './CodeDrawer.less';

interface IProps {
  component: any;
  visible: boolean;
  handleCB?: any;
}

const CodeDrawer = (props: IProps) => {
  const { handleCB } = props;
  const codeRef: any = React.useRef(null);

  const onClose = () => {
    handleCB && handleCB({ visible: false });
  };

  const handleSave = () => {
    console.log('codeRef.current', codeRef.current);
    const code = codeRef.current.getEditorValue();
    console.log('code', code);
    if (code) {
      handleCB && handleCB({ visible: false, code });
    }
  };
  const titleNode = () => (
    <div className={styles['title-con']}>
      <div className={styles['title']}>代码编辑</div>
      <Tooltip title="保存">
        <Button
          type="link"
          icon={<SaveOutlined />}
          onClick={() => handleSave()}
        ></Button>
      </Tooltip>
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
        value={props.component}
        ref={(ref: any) => (codeRef.current = ref)}
      />
    </Drawer>
  );
};

export default CodeDrawer;
