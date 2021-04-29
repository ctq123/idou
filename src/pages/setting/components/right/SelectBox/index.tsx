import React from 'react';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import styles from './index.less';

interface IProps {
  style: object;
}

const SelectBox = (props: IProps) => {
  const { style } = props;
  return (
    <div className={styles['select-box']} style={style}>
      <div className={styles['top']}>
        <span title="上移">
          <ArrowUpOutlined />
        </span>
        <span title="下移">
          <ArrowDownOutlined />
        </span>
        <span title="复制">
          <CopyOutlined />
        </span>
        <span title="删除">
          <DeleteOutlined />
        </span>
      </div>
    </div>
  );
};

export default SelectBox;
