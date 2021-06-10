import React, { PureComponent } from 'react';
import { message } from 'antd';
import Editor, { useMonaco } from '@monaco-editor/react';
import { serialize, deserialize, prettierFormat, transformFunc } from '@/utils';
interface IProps {
  value: any;
  type?: 'component' | 'vue' | 'function' | 'html';
  [key: string]: any;
}
class CodeEditor extends PureComponent<IProps> {
  editorRef: any = null;
  CONFIG: any = ``;

  setEditorValue = (val: any) => {
    const { type } = this.props;
    this.CONFIG = ``;
    switch (type) {
      case 'component':
        this.CONFIG = `const config = `;
        return `${this.CONFIG}${serialize(val, { space: 2, unsafe: true })}`;
      case 'html':
        return prettierFormat(val, 'html');
      case 'function':
        return prettierFormat(val, 'babel');
      case 'vue':
      default:
        return val;
    }
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
    const { type } = this.props;
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
      if (type === 'component') {
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
    const language = type === 'vue' ? `html` : `javascript`;

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
