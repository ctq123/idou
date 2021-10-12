import React, { useEffect, useState } from 'react';
import {
  Button,
  Drawer,
  Tooltip,
  message,
  Modal,
  Form,
  Input,
  Tabs,
} from 'antd';
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import JSZIP from 'jszip';
import CodeEditor from './index';
import { serialize, deserialize } from '@/utils';
import { saveAs } from 'file-saver';
import styles from './CodeDrawer.less';
interface IProps {
  valueList: any[];
  visible: boolean;
  handleCB?: any;
}

const { TabPane } = Tabs;
const SourceCodeDrawer = (props: IProps) => {
  const { valueList = [], handleCB } = props;
  const [tab, setTab] = useState('0');
  const [modalVisible, setModalVisible] = useState(false);
  // const [monacoLanguage, setMonacoLanguage] = useState('javascript')
  const codeRef: any = React.useRef(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.visible) {
      setTab('0');
    }
  }, [props.visible]);

  const onClose = () => {
    handleCB && handleCB({ visible: false });
    gtag('event', 'onClose', {
      event_category: 'SourceCodeDrawer',
      event_label: `关闭源码`,
      value: 1,
    });
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
    gtag('event', 'handleCopy', {
      event_category: 'SourceCodeDrawer',
      event_label: `复制源码`,
      value: 1,
    });
  };

  const handleDown = () => {
    form.resetFields();
    setModalVisible(true);
    gtag('event', 'handleDown', {
      event_category: 'SourceCodeDrawer',
      event_label: `显示源码文件夹设置`,
      value: 1,
    });
  };

  const handleDownloadCode = (folderName: string, cb: any) => {
    try {
      const code = codeRef.current.getEditorValue();
      const val = serialize(code, { space: 2 });
      const str = deserialize(val);

      const zip = new JSZIP();
      let fold: any = zip.folder(folderName);
      valueList.forEach((item, i) => {
        if (i === Number(tab)) {
          fold.file(item.fileName, str);
        } else {
          fold.file(item.fileName, item.fileCode);
        }
      });
      // fold.file('index.vue', str);
      zip.generateAsync({ type: 'blob' }).then(function (content: any) {
        saveAs(content, 'code.zip');
        cb && cb();
      });
    } catch (e) {
      message.error('下载异常');
      console.error(e);
    }
    gtag('event', 'onFinish', {
      event_category: 'SourceCodeDrawer',
      event_label: `下载源码`,
      value: 1,
    });
  };

  const onFinish = async () => {
    const values = await form.validateFields();
    // values
    handleDownloadCode(values.folderName, () => setModalVisible(false));
  };

  const titleNode = () => (
    <div className={styles['title-con']}>
      <div className={styles['title']}>源码</div>
      <div>
        <Tooltip title="复制">
          <Button
            id={'btn-copy-code'}
            type="link"
            icon={<CopyOutlined />}
            onClick={() => handleCopy()}
          ></Button>
        </Tooltip>
        <Tooltip title="下载">
          <Button
            id={'btn-download-code'}
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => handleDown()}
          ></Button>
        </Tooltip>
      </div>
    </div>
  );

  const generateTab = () => {
    return (valueList || []).map((item, i) => {
      const { fileName = '', fileCode = '' } = item || {};
      const pointerIndex = fileName.lastIndexOf('.');
      const fileType = fileName.substring(pointerIndex + 1);
      let language;
      switch (fileType) {
        case 'vue':
          language = 'html';
          break;
        case 'less':
          language = 'less';
          break;
        default:
          language = 'javascript';
          break;
      }
      return (
        <TabPane tab={fileName} key={i.toString()}>
          <CodeEditor
            value={fileCode}
            language={language}
            ref={(ref: any) => (codeRef.current = ref)}
          />
        </TabPane>
      );
    });
  };

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
      <Tabs activeKey={tab} onChange={(k) => setTab(k)}>
        {generateTab()}
      </Tabs>

      <Modal
        title="源码文件夹设置"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            id={'btn-download-zip'}
            key="submit"
            type="primary"
            htmlType="submit"
            onClick={onFinish}
          >
            下载
          </Button>,
          <Button
            id={'btn-download-zip-cancel'}
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
            <Input
              id={'input-folder-name'}
              placeholder="请输入文件夹名称，子文件夹使用/分隔"
              allowClear
            />
          </Form.Item>
        </Form>
      </Modal>
    </Drawer>
  );
};

export default SourceCodeDrawer;
