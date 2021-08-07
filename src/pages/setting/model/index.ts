import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
// import { DSL } from '../const/dsl';
import { DSL as ListDSL } from '../const/listDSL';
import { DSL as DetailDSL } from '../const/detailDSL';
import { DSL as EditModalDSL } from '../const/editModalDSL';
import { DSL as EditDSL } from '../const/editDSL';
import { getUid } from '@/utils';
import { getSourceCode as generateReactCode } from './generateReact';
import { getSourceCode as generateVueCode } from './generateVue';
import { getSourceCode as generateVue3Code } from './generateVue3';
import { VueTableRenderXML } from './componentXML';
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
const addUuid = (data: IObject) => {
  const copyData = cloneDeep(data);
  const addDataUuid = (data: IObject) => {
    if (data) {
      if (Array.isArray(data.children)) {
        data.uuid = getUid();
        data.children.forEach((item) => addDataUuid(item));
      } else if (data.isEdit) {
        data.uuid = getUid();
      }
    }
  };
  addDataUuid(copyData);
  return copyData;
};

const initState = {
  dsl: addUuid(ListDSL),
  selectedComponent: null,
  sourceCode: null,
  apiCode: null,
  styleCode: null,
  codeType: 'vue2',
  prefixUI: 'el',
  showSourceCode: false,
  dslType: 'list',
  VueTableRenderXML,
};

const reducer = (state: any, action: any) => {
  const { type, data } = action;
  const { component, from, to, apis } = data || {};
  console.log('data', data);
  switch (type) {
    case 'component/add':
      const newComponent = addUuid(component);
      const { newDSL: addDSL } = handleDSLComponentChange(
        state.dsl,
        newComponent,
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
    case 'generate/vue2':
      const vue2DSL = cloneDeep(state.dsl);
      const { vue2Code, vue2ApiCode } =
        generateVueCode(vue2DSL, state.prefixUI) || {};
      // console.log('vueCode', vueCode);
      if (!vue2Code) return { ...state };
      return {
        ...state,
        sourceCode: vue2Code,
        apiCode: vue2ApiCode,
        showSourceCode: !state.showSourceCode,
        codeType: 'vue2',
      };
    case 'generate/vue3':
      const vue3DSL = cloneDeep(state.dsl);
      const { vue3Code, vue3ApiCode } =
        generateVue3Code(vue3DSL, state.prefixUI) || {};
      // console.log('vue3Code', vue3Code);
      if (!vue3Code) return { ...state };
      return {
        ...state,
        sourceCode: vue3Code,
        apiCode: vue3ApiCode,
        showSourceCode: !state.showSourceCode,
        codeType: 'vue3',
      };
    case 'generate/react':
      const reactDSL = cloneDeep(state.dsl);
      const { reactCode, reactApiCode, styleCode } =
        generateReactCode(reactDSL, state.prefixUI) || {};
      // console.log('reactCode', reactCode);
      if (!reactCode) return { ...state };
      return {
        ...state,
        sourceCode: reactCode,
        apiCode: reactApiCode,
        styleCode,
        showSourceCode: !state.showSourceCode,
        codeType: 'react',
      };
    case 'dsl/apis/update':
      const newDSL2 = cloneDeep(state.dsl);
      newDSL2.apis = apis;
      return { ...state, dsl: newDSL2 };
    case 'dsl/uilib/update':
      return { ...state, codeType: data.codeType, prefixUI: data.prefixUI };
    case 'dsl/type/update':
      let newTypeDSL = null;
      switch (data.dslType) {
        case 'detail':
          newTypeDSL = DetailDSL;
          break;
        case 'editModal':
          newTypeDSL = EditModalDSL;
          break;
        case 'edit':
          newTypeDSL = EditDSL;
          break;
        case 'list':
        default:
          newTypeDSL = ListDSL;
          break;
      }
      return {
        ...state,
        dslType: data.dslType,
        dsl: addUuid(newTypeDSL),
        selectedComponent: null,
      };
    default:
      return state;
  }
};

const Context = React.createContext(null);

export { initState, reducer, Context };
