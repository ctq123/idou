/*
 * @Author: chengtianqing
 * @Date: 2021-06-07 01:10:38
 * @LastEditTime: 2021-06-14 03:32:40
 * @LastEditors: chengtianqing
 * @Description:
 */
import dayjs from 'dayjs';

const lastDataCache: any = {};
/**
 * 根据key获取对应的数据
 * @param keyStr
 */
const createMockData = (keyStr: string, i: number) => {
  const mockTypes = [
    {
      keys: ['number', 'id'],
      value: Date.now().toString().substr(-8) + i,
    },
    {
      keys: ['no', 'name', 'code'],
      value: 'AB' + Math.random().toString(36).slice(-8) + i,
    },
    {
      keys: ['mount', 'price'],
      value: Math.floor(Math.random() * 100) * 100,
    },
    {
      keys: ['status'],
      value: Math.floor(Math.random() * 4),
    },
    {
      keys: ['time'],
      value: dayjs().subtract(i, 'days').format('YYYY-MM-DD HH:mm:ss'),
    },
  ];
  for (let i = 0; i < mockTypes.length; i++) {
    let item = mockTypes[i];
    if (item.keys.find((it) => keyStr.toLowerCase().indexOf(it) > -1)) {
      return item.value;
    }
  }
  return Math.random().toString(36).slice(-6);
};

/**
 * 异步获取数据
 * @param params
 */
export function getMockListAsync(data = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(getMockListSync(data));
    }, 1000);
  });
}

/**
 * 同步获取数据
 * @param data
 * @returns
 */
export function getMockListSync(data = {}) {
  const keys = Object.keys(data).join('-');
  const list: any = [];
  if (!keys) {
    return [];
  }
  if (lastDataCache[keys]) {
    return lastDataCache[keys];
  }
  if (Object.keys(lastDataCache).length >= 500) {
    // 防止缓存数据过大
    Object.keys(lastDataCache).forEach((k) => {
      delete lastDataCache[k];
    });
  }
  for (let i = 0; i < 3; i++) {
    let item: any = {};
    Object.keys(data).forEach((k) => {
      item[k] = createMockData(k, i);
    });
    if (item.id === undefined) {
      item.id = createMockData('id', i);
    }
    list.push(item);
  }
  lastDataCache[keys] = list;
  return list;
}
