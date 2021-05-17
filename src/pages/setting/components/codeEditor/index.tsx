import React, { PureComponent } from 'react';
import { message } from 'antd';
import Editor, { useMonaco } from '@monaco-editor/react';
import serialize from 'serialize-javascript';

interface IProps {
  value: any;
  [key: string]: any;
}
const CONFIG = `const config = `;
class CodeEditor extends PureComponent<IProps> {
  editorRef: any = null;

  setEditorValue = (val: any) => {
    return `${CONFIG}${serialize(val, { space: 2, unsafe: true })}`;
  };

  getEditorValue = () => {
    const value = this.editorRef.getValue().slice(CONFIG.length);
    const deserialize = (code: any) => {
      return eval('(' + code + ')');
    };
    try {
      const code = deserialize(value);
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
    });
  };

  render() {
    const { value } = this.props;
    return (
      <Editor
        height={`calc(100vh - ${100}px)`}
        language="javascript"
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
