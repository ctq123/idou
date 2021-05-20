import React, { useEffect, useState } from 'react';
import { Button, Drawer, Tooltip, message, Modal, Form, Input } from 'antd';
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
  const [modalVisible, setModalVisible] = useState(false);
  const codeRef: any = React.useRef(null);
  const [form] = Form.useForm();

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
    // try {
    //   const code = codeRef.current.getEditorValue();
    //   const val = serialize(code, { space: 2 });
    //   const str = deserialize(val);

    //   const zip = new JSZip();
    //   const folderName = 'code/common';
    //   let fold: any = zip.folder(folderName);
    //   fold.file('index.vue', str);
    //   zip.generateAsync({ type: 'blob' }).then(function (content) {
    //     saveAs(content, 'code.zip');
    //   });
    // } catch (e) {
    //   message.error('下载异常');
    //   console.error(e);
    // }
    form.resetFields();
    setModalVisible(true);
  };
  const handleDownloadCode = (folderName: string, cb: any) => {
    try {
      const code = codeRef.current.getEditorValue();
      const val = serialize(code, { space: 2 });
      const str = deserialize(val);

      const zip = new JSZip();
      let fold: any = zip.folder(folderName);
      fold.file('index.vue', str);
      zip.generateAsync({ type: 'blob' }).then(function (content) {
        saveAs(content, 'code.zip');
        cb && cb();
      });
    } catch (e) {
      message.error('下载异常');
      console.error(e);
    }
  };
  const onFinish = async () => {
    const values = await form.validateFields();
    // values
    handleDownloadCode(values.folderName, () => setModalVisible(false));
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
      <Modal
        title="源码文件夹设置"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            onClick={onFinish}
          >
            下载
          </Button>,
          <Button
            key="cancel"
            type="default"
            htmlType="submit"
            onClick={() => setModalVisible(false)}
          >
            取消
          </Button>,
        ]}
      >
        <Form form={form} initialValues={{ folderName: 'code' }}>
          <Form.Item
            label="文件夹名称"
            name="folderName"
            rules={[
              {
                required: true,
                pattern: /[\w\\]/,
                message: '请输入文件夹名称，子文件夹使用/分隔',
              },
            ]}
          >
            <Input placeholder="请输入文件夹名称，子文件夹使用/分隔" />
          </Form.Item>
        </Form>
      </Modal>
    </Drawer>
  );
};

export default CodeDrawer;
