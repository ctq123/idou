import React, { useState } from 'react';
import Header from './components/header';
import Left from './components/left';
import Right from './components/right';
import styles from './index.less';

const SettingPage = () => {
  return (
    <div className={styles['container']}>
      <Header />
      <div className={styles['c-body']}>
        <Left />
        <Right />
      </div>
    </div>
  );
};

export default SettingPage;
