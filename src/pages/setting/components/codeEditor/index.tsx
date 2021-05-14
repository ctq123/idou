import React, { useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import serialize from 'serialize-javascript';

interface IProps {
  value: any;
  [key: string]: any;
}
const CONFIG = `const config = `;

const CodeEditor = (props: IProps) => {
  const editorRef: any = React.useRef(null);

  const setEditorValue = (val: any) => {
    return `${CONFIG}${serialize(val, { space: 2, unsafe: true })}`;
  };

  const getEditorValue = () => {
    return editorRef.current.getValue().slice(CONFIG.length);
  };

  const onEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    editor.onKeyDown((e: any) => {
      if (e.shiftKey) {
        editorRef.current &&
          editorRef.current.trigger(
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

  return (
    <Editor
      height={`calc(100vh - ${100}px)`}
      language="javascript"
      onMount={onEditorDidMount}
      options={{
        selectOnLineNumbers: true,
        renderSideBySide: false,
        overviewRulerBorder: false,
        tabSize: 2,
        minimap: {
          enabled: false,
        },
      }}
      value={setEditorValue(props.value)}
    />
  );
};

export default CodeEditor;
