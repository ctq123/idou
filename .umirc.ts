import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/code', component: '@/pages/code/index' },
    { path: '/setting', component: '@/pages/setting/index' },
  ],
  fastRefresh: {},
});
