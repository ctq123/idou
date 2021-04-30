import React from 'react';
import Parser from './Parser';
import styles from './index.less';

const Right = () => {
  return (
    <div className={styles['b-right']}>
      <div className={styles['content']}>
        <Parser />
      </div>
    </div>
  );
};

export default Right;
