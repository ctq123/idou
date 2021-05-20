import React, { useEffect, useState } from 'react';
import { Button, Drawer, Tooltip, message } from 'antd';
import {
  SaveOutlined,
  CopyOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import CodeEditor from './index';
import { serialize, deserialize } from '@/utils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import styles from './CodeDrawer.less';

interface IProps {
  value: any;
  visible: boolean;
  type?: 'component' | 'vue';
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
  const handleCopy = () => {
    try {
      const code = codeRef.current.getEditorValue();
      // console.log('code', code);
      const val = serialize(code, { space: 2 });
      copy(deserialize(val));
      message.success('复制成功');
    } catch (e) {
      message.error('复制异常');
      console.error(e);
    }
  };
  const handleDown = () => {
    try {
      const code = codeRef.current.getEditorValue();
      const val = serialize(code, { space: 2 });
      const str = deserialize(val);

      const zip = new JSZip();
      const folderName = 'code';
      let fold: any = zip.folder(folderName);
      fold.file('index.vue', str);
      zip.generateAsync({ type: 'blob' }).then(function (content) {
        saveAs(content, 'example.zip');
      });
    } catch (e) {
      message.error('下载异常');
      console.error(e);
    }
  };
  const titleNode = () => (
    <div className={styles['title-con']}>
      <div className={styles['title']}>
        {type === 'component' ? '代码编辑' : 'vue源码'}
      </div>
      {type === 'component' ? (
        <div>
          <Tooltip title="保存">
            <Button
              type="link"
              icon={<SaveOutlined />}
              onClick={() => handleSave()}
            ></Button>
          </Tooltip>
        </div>
      ) : (
        <div>
          <Tooltip title="复制">
            <Button
              type="link"
              icon={<CopyOutlined />}
              onClick={() => handleCopy()}
            ></Button>
          </Tooltip>
          <Tooltip title="下载">
            <Button
              type="link"
              icon={<DownloadOutlined />}
              onClick={() => handleDown()}
            ></Button>
          </Tooltip>
        </div>
      )}
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
