import React from 'react';
import { Modal, Button } from 'antd';
import CodeEditor from './index';

interface IProps {
  value: any;
  visible: boolean;
  type?: 'component' | 'function' | 'html';
  title?: string;
  handleCB?: any;
}

const CodeModal = (props: IProps) => {
  const { handleCB, type = 'component', title = '选项设置' } = props;
  const codeRef: any = React.useRef(null);

  const handleSave = () => {
    const code = codeRef.current.getEditorValue();
    console.log('code', code);
    handleCB && handleCB({ visible: false, code });
    gtag('event', 'handleSave', {
      event_category: 'CodeModal',
      event_label: `确定`,
      value: 1,
    });
  };

  const handleClear = () => {
    const obj = {};
    codeRef && codeRef.current.forceSetEditorValue(obj);
  };

  return (
    <Modal
      title={title}
      visible={props.visible}
      onCancel={() => handleSave()}
      onOk={() => handleSave()}
      footer={[
        // <Button key="back" onClick={() => handleClear()}>
        //   清空
        // </Button>,
        <Button
          id={'btn-code-modal-cancel'}
          key="back"
          onClick={() => handleSave()}
        >
          取消
        </Button>,
        <Button
          id={'btn-code-modal-save'}
          key="submit"
          type="primary"
          onClick={() => handleSave()}
        >
          确定
        </Button>,
      ]}
    >
      <CodeEditor
        value={props.value}
        type={type}
        height={400}
        ref={(ref: any) => (codeRef.current = ref)}
      />
    </Modal>
  );
};

export default CodeModal;
