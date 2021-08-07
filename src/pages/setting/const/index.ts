/*
 * @Author: chengtianqing
 * @Date: 2021-06-14 01:33:29
 * @LastEditTime: 2021-06-27 02:49:10
 * @LastEditors: chengtianqing
 * @备注: 图片中无敏感信息
 */
import { getDomain } from '@/utils';
/**
 * 左侧内容tab
 */
export const tabs = [
  { code: 'template', label: '模版' },
  { code: 'component', label: '组件' },
  { code: 'setting', label: '设置' },
  { code: 'request', label: '请求' },
  { code: 'uilib', label: 'UI库' },
];

const domain = getDomain();
const baseUrl = `https://cdn.${domain}.com/node-common`;

/**
 * UI库
 */
export const UILib: any = {
  react: [
    {
      prefixUI: '',
      name: 'Ant Design',
      libUrl: 'https://ant.design/components/overview-cn/',
      iconUrl:
        'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    },
  ],
  vue2: [
    {
      prefixUI: 'el',
      name: 'Element UI',
      libUrl: 'https://element.eleme.io/#/zh-CN/component/installation',
      iconUrl: `${baseUrl}/3f4f24f336036d47968bb94f0a87fe36.png`,
    },
    {
      prefixUI: 'a',
      name: 'Ant Design Vue',
      libUrl: 'https://1x.antdv.com/docs/vue/introduce-cn',
      iconUrl: 'https://alicdn.antdv.com/v2/assets/logo.1ef800a8.svg',
    },
  ],
  vue3: [
    {
      prefixUI: 'el',
      name: 'Element Plus UI',
      libUrl: 'https://element-plus.org/#/zh-CN/component/installation',
      iconUrl: `${baseUrl}/3f4f24f336036d47968bb94f0a87fe36.png`,
    },
    {
      prefixUI: 'a',
      name: 'Ant Design Vue',
      libUrl: 'https://2x.antdv.com/components/overview-cn/',
      iconUrl: 'https://alicdn.antdv.com/v2/assets/logo.1ef800a8.svg',
    },
  ],
};

/**
 * 模版
 */
export const templates = [
  {
    code: 'list',
    label: '管理列表',
    img: `${baseUrl}/fa2b31239e9b8d18d0ff2a85186a665e.png`,
  },
  {
    code: 'detail',
    label: '弹窗详情',
    img: `${baseUrl}/cbd6486d427d9f7fd9a8119fb3d11b0f.png`,
  },
  {
    code: 'editModal',
    label: '弹窗编辑',
    img: `${baseUrl}/409459c03e1caf55df0b87ec31be1523.png`,
  },
  {
    code: 'edit',
    label: '编辑页面',
    img: `${baseUrl}/9848298872089476cd6d678c1f1168f4.png`,
  },
];
