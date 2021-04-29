import { v1 } from 'uuid';
import cloneDeep from 'lodash/cloneDeep';
import { DSL } from './dsl';

interface IObject {
  [key: string]: any;
}

interface Position {
  index: number;
  uuid: string;
}

/**
 * 编辑数组
 * @param source
 * @param arr
 * @param obj
 * @param type
 * @returns
 */
const editArray = (
  source: Position,
  arr: Array<any> = [],
  obj = null,
  type = 'remove',
) => {
  let target = null;
  switch (type) {
    case 'add':
      [target] = arr.splice(source.index, 0, obj);
      break;
    case 'remove':
      [target] = arr.splice(source.index, 1);
      break;
    case 'replace':
      [target] = arr.splice(source.index, 1, obj);
      break;
    default:
      break;
  }
  return target;
};

/**
 * 递归处理数组
 * @param arr
 * @param obj
 * @param type
 * @param source
 * @returns
 */
const handleTarget = (
  source: Position,
  arr: Array<any> = [],
  obj = null,
  type = 'remove',
): any => {
  // 递归处理
  if (Array.isArray(arr)) {
    const targetParent = arr
      .filter(Boolean)
      .find(({ uuid }) => uuid === source.uuid);
    if (targetParent) {
      return editArray(source, targetParent.children, obj, type);
    }
    // BFS广度优先遍历
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        const t = handleTarget(source, arr[i].children, obj, type);
        if (t) return t;
      }
    }
  }
  return null;
};

/**
 * 为dsl添加uuid
 * @param data
 * @returns
 */
const addUuid = (data: IObject) => {
  if (data) {
    data.uuid = v1();
    if (Array.isArray(data.children)) {
      data.children.forEach((item) => addUuid(item));
    }
  }
  return data;
};

const handleDLSChange = (oldDSL: IObject, newData = null, type = 'init') => {
  const copyDSL = cloneDeep(oldDSL);
  const newList: Array<any> = [copyDSL];
  switch (type) {
    case 'init':
      return addUuid(copyDSL);
    case 'add':
    default:
      break;
  }
};

const initState = {
  dsl: handleDLSChange(DSL, null, 'init'),
};

const reducer = (state: any, action: any) => {
  const { type, data } = action;
  switch (type) {
    case 'change':
      const newDSL = { ...state.DSL, ...data };
      return { ...state, DSL: newDSL };
    default:
      return state;
  }
};

export { initState, reducer };
