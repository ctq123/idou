
import React, { useState, useRef } from 'react'
import GenerateVue from './GenerateVue'
import GenerateReact from './GenerateReact'
import Online from './online'

export default function CodePage() {
  const vueEl = useRef(null)
  const reactEl = useRef(null)

  const generateCode = (type: any) => {
    if (type === 'react') {
      return reactEl.current.getSourceCode()
    } else {
      return vueEl.current.getSourceCode()
    }
  }
  
  return (
    <div>
      <GenerateVue ref={vueEl} showGenerateButton={false} />
      <br />
      <GenerateReact ref={reactEl} showGenerateButton={false} />
      <br />
      <Online generateCode={(type: any) => generateCode(type)}  />
    </div>
  );
}
