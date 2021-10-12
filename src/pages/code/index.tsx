import React, { useState, useRef } from 'react';
import GenerateVue from './GenerateVue';
import GenerateReact from './GenerateReact';
import Online from './online';
import ErrorBoundary from '../ErrorBoundary';

export default function CodePage() {
  const vueEl = useRef(null);
  const reactEl = useRef(null);

  const generateCode = (type: any) => {
    if (type === 'react') {
      return reactEl.current.getSourceCode();
    } else {
      return vueEl.current.getSourceCode();
    }
  };

  return (
    <div>
      <ErrorBoundary>
        <GenerateVue ref={vueEl} showGenerateButton={true} />
      </ErrorBoundary>
      <br />
      <ErrorBoundary>
        <GenerateReact ref={reactEl} showGenerateButton={false} />
      </ErrorBoundary>
      <br />
      <ErrorBoundary>
        <Online generateCode={(type: any) => generateCode(type)} />
      </ErrorBoundary>
    </div>
  );
}
