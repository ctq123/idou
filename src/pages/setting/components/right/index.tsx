import React from 'react';
import Parser from './Parser';
import { DSL } from '../../const/dsl';
import styles from './index.less';

const Right = () => {
  return (
    <div className={styles['b-right']}>
      <div className={styles['content']}>
        <Parser dsl={DSL} />
      </div>
    </div>
  );
};

export default Right;
