import React, { useReducer } from 'react';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CopyOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import styles from './index.less';

interface IProps {
  style: object;
  handleCB: Function;
}

const SelectBox = (props: IProps) => {
  const { style, handleCB } = props;
  return (
    <div className={styles['select-box']} style={style}>
      <div className={styles['top']}>
        <span
          title="上移"
          id={'select-action-up'}
          onClick={() => handleCB('up')}
        >
          <ArrowUpOutlined />
        </span>
        <span
          title="下移"
          id={'select-action-down'}
          onClick={() => handleCB('down')}
        >
          <ArrowDownOutlined />
        </span>
        <span
          title="添加"
          id={'select-action-add'}
          onClick={() => handleCB('add')}
        >
          <PlusOutlined />
        </span>
        <span
          title="复制"
          id={'select-action-copy'}
          onClick={() => handleCB('copy')}
        >
          <CopyOutlined />
        </span>
        <span
          title="删除"
          id={'select-action-delete'}
          onClick={() => handleCB('delete')}
        >
          <DeleteOutlined />
        </span>
      </div>
    </div>
  );
};

export default SelectBox;
