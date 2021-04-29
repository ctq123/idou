import React, { useState } from 'react';
import { Link } from 'umi';
import styles from './index.less';

const IndexPage = () => {
  return (
    <div className={styles['container']}>
      <Link to="/setting">转跳配置页</Link>
    </div>
  );
};

export default IndexPage;
