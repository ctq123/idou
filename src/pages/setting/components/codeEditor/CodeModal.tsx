import React from 'react';
import { Modal } from 'antd';
import CodeEditor from './index';

interface IProps {
  value: any;
  visible: boolean;
  type?: 'component' | 'function' | 'html';
  title?: string;
  handleCB?: any;
}

const CodeModal = (props: IProps) => {
  const { handleCB, type = 'component', title = '枚举值设置' } = props;
  const codeRef: any = React.useRef(null);

  const onClose = () => {
    handleCB && handleCB({ visible: false });
  };

  const handleSave = () => {
    const code = codeRef.current.getEditorValue();
    console.log('code', code);
    handleCB && handleCB({ visible: false, code });
  };

  return (
    <Modal
      title={title}
      visible={props.visible}
      onCancel={() => handleSave()}
      onOk={() => handleSave()}
      okText="确定"
      cancelText="取消"
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
