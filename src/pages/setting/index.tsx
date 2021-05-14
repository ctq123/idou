import React, { useState, useReducer } from 'react';
import Header from './components/header';
import Left from './components/left';
import Right from './components/right';
import { reducer, initState, Context } from '@/pages/setting/model';
import styles from './index.less';

const SettingPage = () => {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <div className={styles['container']}>
      <Context.Provider value={{ state, dispatch }}>
        <Header />
        <div className={styles['c-body']}>
          <Left />
          <Right />
        </div>
      </Context.Provider>
    </div>
  );
};

export default SettingPage;
