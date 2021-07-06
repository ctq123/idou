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
];

const domain = getDomain();
const baseUrl = `https://cdn.${domain}.com/node-common`;
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
