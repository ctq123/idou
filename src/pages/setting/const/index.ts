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
    img: `${baseUrl}/19c23cb0870e583a3f10fcee4e5686c6.png`,
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
