import './wdyr';
import React, { useState, useReducer } from 'react';
import Header from './components/header';
import Left from './components/left';
import Right from './components/right';
import ErrorBoundary from '../ErrorBoundary';
import { reducer, initState, Context } from '@/pages/setting/model';
import styles from './index.less';

const SettingPage = () => {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <div className={styles['container']}>
      <ErrorBoundary>
        <Context.Provider value={{ state, dispatch }}>
          <ErrorBoundary>
            <Header />
          </ErrorBoundary>
          <div className={styles['c-body']}>
            <ErrorBoundary>
              <Left />
            </ErrorBoundary>
            <ErrorBoundary>
              <Right />
            </ErrorBoundary>
          </div>
        </Context.Provider>
      </ErrorBoundary>
    </div>
  );
};

// SettingPage.whyDidYouRender = true

export default SettingPage;
