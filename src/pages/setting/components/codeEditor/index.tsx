import React, { PureComponent } from 'react';
import { message } from 'antd';
import Editor, { useMonaco } from '@monaco-editor/react';
import { serialize, deserialize } from '@/utils';
interface IProps {
  value: any;
  type?: 'component' | 'vue';
  [key: string]: any;
}
class CodeEditor extends PureComponent<IProps> {
  editorRef: any = null;
  CONFIG: any = this.props.type === 'component' ? `const config = ` : ``;

  setEditorValue = (val: any) => {
    const { type } = this.props;
    return type === 'component'
      ? `${this.CONFIG}${serialize(val, { space: 2, unsafe: true })}`
      : val;
  };

  getEditorValue = () => {
    const { type } = this.props;
    const value = this.editorRef.getValue().slice(this.CONFIG.length);
    try {
      const code = type === 'component' ? deserialize(value) : value;
      return code;
    } catch (e) {
      message.error(`JSON 格式错误`);
    }
  };

  onEditorDidMount = (editor: any, monaco: any) => {
    this.editorRef = editor;
    editor.onKeyDown((e: any) => {
      if (e.shiftKey) {
        this.editorRef &&
          this.editorRef.trigger(
            'auto completion',
            'editor.action.triggerSuggest',
          );
      }
    });
    editor.onDidChangeCursorPosition((e: any) => {
      const lineCount = editor.getModel().getLineCount();
      if (this.CONFIG) {
        if (e.position.lineNumber === 1) {
          editor.setPosition({
            lineNumber: 2,
            column: 1,
          });
        } else if (e.position.lineNumber === lineCount) {
          editor.setPosition({
            lineNumber: lineCount - 1,
            column: 1,
          });
        }
      }
    });
  };

  render() {
    const { value, type } = this.props;
    const language = type === 'component' ? `javascript` : `html`;
    return (
      <Editor
        height={`calc(100vh - ${100}px)`}
        language={language}
        onMount={this.onEditorDidMount}
        options={{
          selectOnLineNumbers: true,
          renderSideBySide: false,
          overviewRulerBorder: false,
          tabSize: 2,
          // minimap: {
          //   enabled: false,
          // },
        }}
        value={this.setEditorValue(value)}
      />
    );
  }
}

export default CodeEditor;
