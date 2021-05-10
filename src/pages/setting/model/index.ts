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
 * @param arr
 * @param obj
 * @param index
 * @param type
 * @returns
 */
const editArray = (
  arr: any,
  obj: IObject | null,
  index: number,
  type: string,
) => {
  let target = null;
  if (Array.isArray(arr)) {
    switch (type) {
      case 'add':
        [target] = arr.splice(index, 0, obj);
        break;
      case 'delete':
        [target] = arr.splice(index, 1);
        break;
      case 'replace':
        [target] = arr.splice(index, 1, obj);
        break;
      default:
        break;
    }
  }
  return target;
};

/**
 * 递归处理数组
 * @param list
 * @param obj
 * @param position
 * @param type
 * @returns
 */
const handleTarget = (
  list: any,
  obj: IObject,
  position: Position,
  type: string,
): any => {
  // 递归处理
  if (Array.isArray(list) && position) {
    const parent = list.find(({ uuid }) => uuid === position.uuid);
    if (parent) {
      return editArray(parent.children, obj, position.index, type);
    }
    // BFS广度优先遍历
    for (let i = 0; i < list.length; i++) {
      if (list[i]) {
        const target = handleTarget(list[i].children, obj, position, type);
        if (target) return target;
      }
    }
  }
  return null;
};

/**
 * 处理dsl的component变更
 * @param dsl
 * @param component
 * @param position
 * @param type
 * @returns
 */
const handleDSLComponentChange = (
  dsl: IObject,
  component: IObject,
  position: Position,
  type: string,
) => {
  const newDSL = cloneDeep(dsl);
  const newList = [newDSL];
  const target = handleTarget(newList, component, position, type);
  return { newDSL, target };
};

/**
 * 为dsl添加uuid
 * @param data
 * @returns
 */
const initDSL = (data: IObject) => {
  const copyData = cloneDeep(data);
  const addUuid = (data: IObject) => {
    if (data) {
      data.uuid = v1();
      if (Array.isArray(data.children)) {
        data.children.forEach((item) => addUuid(item));
      }
    }
  };
  addUuid(copyData);
  return copyData;
};

const initState = {
  dsl: initDSL(DSL),
  selectedComponent: null,
};

const reducer = (state: any, action: any) => {
  const { type, data } = action;
  const { component, from, to } = data || {};
  console.log('data', data);
  switch (type) {
    case 'component/add':
      const { newDSL: addDSL } = handleDSLComponentChange(
        state.dsl,
        component,
        to,
        'add',
      );
      return { ...state, dsl: addDSL };
    case 'component/replace':
      const { newDSL: replaceDSL } = handleDSLComponentChange(
        state.dsl,
        component,
        from,
        'replace',
      );
      return { ...state, dsl: replaceDSL };
    case 'component/delete':
      const { newDSL: deleteDSL } = handleDSLComponentChange(
        state.dsl,
        component,
        from,
        'delete',
      );
      return { ...state, dsl: deleteDSL };
    case 'component/move':
      const { newDSL: moveDSL1, target } = handleDSLComponentChange(
        state.dsl,
        component,
        from,
        'delete',
      );
      const { newDSL: moveDSL2 } = handleDSLComponentChange(
        moveDSL1,
        target,
        to,
        'add',
      );
      return { ...state, dsl: moveDSL2 };
    case 'component/selected':
      return { ...state, selectedComponent: data };
    default:
      return state;
  }
};

export { initState, reducer };
