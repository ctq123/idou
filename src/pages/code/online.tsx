// @ts-nocheck
// import Vue from 'vue'
// import App from './App'

// new Vue({
//   el: '#app',
//   render: h => h(App),
// })

import React from 'react'
import { Button } from 'antd'
import sdk from '@stackblitz/sdk';

interface IProps {
  generateCode?: any;
}

const Online = (props: IProps) => {
  const handleOnlineVue = () => {
    const code = props.generateCode('vue')
    const html=`<div id="app"></div>`
    const project = {
      files: {
        "index.ts": code,
        "index.html": html
      },
      title: "Dynamically Generated Project",
      description: "Created with <3 by the StackBlitz SDK!",
      template: "typescript",
      tags: ["stackblitz", "sdk"],
      dependencies: {
        "element-ui": "*",
        moment: "*" // * = latest version
      }
    }

    sdk.embedProject("app-code", project, { height: 1000 });
  }

  const handleOnlineReact = () => {
    const code = props.generateCode('react')
    const html=`<div id="app"></div>`
    const project = {
      files: {
        "index.tsx": code,
        "index.html": html
      },
      title: "Dynamically Generated Project",
      description: "Created with <3 by the StackBlitz SDK!",
      template: "create-react-app",
      tags: ["stackblitz", "sdk"],
      dependencies: {
        'antd': "*",
        moment: "*" // * = latest version
      }
    }

    sdk.embedProject("app-code", project, { height: 1000 });
  }

  return (
    <div>
      <Button type="primary" onClick={() => handleOnlineVue()}>
        预览Vue文件
      </Button>
      <span> </span>
      <Button type="primary" onClick={() => handleOnlineReact()}>
        预览React文件
      </Button>
      <br />
      <div id="app-code"></div>
    </div>
  )
}

export default Online
