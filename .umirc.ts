import { defineConfig } from 'umi';
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    // { path: '/code', component: '@/pages/code/index' },
    { path: '/setting', component: '@/pages/setting/index' },
    { component: '@/pages/404' },
  ],
  fastRefresh: {},
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  headScripts: [
    'https://unpkg.com/react@17.0.1/umd/react.production.min.js',
    'https://unpkg.com/react-dom@17.0.1/umd/react-dom.production.min.js',
  ],
  chainWebpack(config) {
    config.plugin('antd-dayjs-webpack-plugin').use(AntdDayjsWebpackPlugin);
  },
});
