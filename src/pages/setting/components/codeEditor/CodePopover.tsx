import React from 'react';
import { Popover, Button } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import CodeEditor from './index';

interface IProps {
  value: any;
  visible: boolean;
  type?: 'component' | 'function' | 'html';
  placement?: any;
  title?: string;
  children?: any;
  handleCB?: any;
}

const CodePopover = (props: IProps) => {
  const { handleCB, type = 'component', placement = 'right', children } = props;
  const codeRef: any = React.useRef(null);

  const onVisibleChange = (v: boolean) => {
    handleCB && handleCB({ visible: v });
  };

  const handleSave = () => {
    const code = codeRef.current.getEditorValue();
    console.log('code', code);
    handleCB && handleCB({ visible: false, code });
  };

  const titleNode = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>{props.title || '编辑'}</div>
      <Button type="link" onClick={() => handleSave()}>
        保存
      </Button>
    </div>
  );

  const contentNode = () => (
    <CodeEditor
      value={props.value}
      type={type}
      ref={(ref: any) => (codeRef.current = ref)}
    />
  );

  return (
    <Popover
      content={contentNode}
      title={titleNode}
      trigger="click"
      placement={placement}
      visible={props.visible}
      onVisibleChange={onVisibleChange}
    >
      {children || (
        <Button type="link" size="small" icon={<UnorderedListOutlined />} />
      )}
    </Popover>
  );
};

export default CodePopover;
