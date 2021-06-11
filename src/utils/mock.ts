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
      value: Math.floor(Math.random() * 10000),
    },
    {
      keys: ['status'],
      value: Math.floor(Math.random() * 4),
    },
    {
      keys: ['time'],
      value: Date.now() - i,
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
 * 获取列表数据-mock
 * @param params
 */
export function getMockDataList(data = {}) {
  return new Promise((resolve, reject) => {
    const list: any = [],
      result: any = {};
    for (let i = 0; i < 3; i++) {
      let item: any = {};
      Object.keys(data).forEach((k) => {
        item[k] = createMockData(k, i);
      });
      list.push(item);
    }
    // result.total = Math.round(Math.random() * 100 + 10)
    // result.list = list
    setTimeout(() => {
      resolve(list);
    }, 1000);
  });
}
