import React, { useReducer } from 'react';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CopyOutlined,
  DeleteOutlined,
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
        <span title="上移" onClick={() => handleCB('up')}>
          <ArrowUpOutlined />
        </span>
        <span title="下移" onClick={() => handleCB('down')}>
          <ArrowDownOutlined />
        </span>
        <span title="复制" onClick={() => handleCB('copy')}>
          <CopyOutlined />
        </span>
        <span title="删除" onClick={() => handleCB('delete')}>
          <DeleteOutlined />
        </span>
      </div>
    </div>
  );
};

export default SelectBox;
