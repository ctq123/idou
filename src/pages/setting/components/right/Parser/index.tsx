// @ts-nocheck
import React, { Fragment, useContext, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import SelectBox from '../SelectBox';
import { Context } from '@/pages/setting/model';
import { getUid } from '@/utils';
import styles from './index.less';
import 'antd/dist/antd.css';

const antd = require('antd');

interface IObject {
  [key: string]: any;
}

interface IComponent {
  componentName: string;
  children?: IComponent[] | any;
  props?: IObject;
  [key: string]: any;
}

interface DSL {
  componentName: string;
  children: IComponent[];
  props?: IObject;
  dataSource?: IObject;
  lifeCycle?: IObject;
  methods?: IObject;
  imports?: IObject;
}

const Parser = () => {
  const appContext: any = useContext(Context);
  const [selectStyle, setSelectStyle] = useState({});
  const [activeComponent, setActiveComponent] = useState<any>({});

  console.log('Parser, state', appContext.state);
  const handleComponentClick = (
    e: any,
    item: any,
    parentUuid: any,
    index: number,
  ) => {
    e && e.stopPropagation();
    try {
      const t = e.currentTarget;
      const rect = t.getBoundingClientRect();
      const { left, top, width, height } = rect || {};
      console.log('rect', rect);
      setSelectStyle({
        left,
        top,
        width,
        height,
        display: 'block',
      });
      setActiveComponent({
        item,
        parentUuid,
        index,
      });
      appContext.dispatch({
        type: 'component/selected',
        data: {
          component: item,
          from: {
            index,
            uuid: parentUuid,
          },
        },
      });
    } catch (e) {}
  };

  const handleOptCB = (action: string) => {
    const { index, parentUuid, item } = activeComponent;
    let type = null;
    let data: any = {};
    let from: any = {};
    let to: any = {};
    switch (action) {
      case 'up':
        type = 'component/move';
        if (index === 0) {
          to['index'] = 0;
          to['uuid'] = parentUuid;
        } else {
          to['index'] = index - 1;
          to['uuid'] = parentUuid;
        }
        from['index'] = index;
        from['uuid'] = parentUuid;
        data = item;
        break;
      case 'down':
        type = 'component/move';
        to['index'] = index + 1;
        to['uuid'] = parentUuid;
        from['index'] = index;
        from['uuid'] = parentUuid;
        data = item;
        break;
      case 'copy':
        type = 'component/add';
        to['index'] = index + 1;
        to['uuid'] = parentUuid;
        data = cloneDeep(item);
        data['key'] = data['key'] + '1';
        if (data['label']) {
          data['label'] = data['label'] + ' 复制';
        }
        break;
      case 'delete':
        type = 'component/delete';
        from['index'] = index;
        from['uuid'] = parentUuid;
        data = item;
        break;
      default:
        break;
    }
    if (type) {
      appContext.dispatch({
        type,
        data: {
          component: data,
          from,
          to,
        },
      });
      setSelectStyle({});
      appContext.dispatch({
        type: 'component/selected',
        data: null,
      });
    }
  };
  const generateComponent = (
    componentDSL: IComponent,
    parentUuid: any,
    index: number,
  ) => {
    const { componentName, children, props, uuid, options = [] } = componentDSL;
    const recursionParser = () => {
      switch (componentName) {
        case 'Page':
          const childNodes = (children || [])
            .filter(Boolean)
            .map((item: any, i: number) => generateComponent(item, uuid, i));
          return <div className={`${styles['page']}`}>{childNodes}</div>;
        case 'Form':
          const Form = antd['Form'];
          const Row = antd['Row'];
          const Col = antd['Col'];
          const formNodes = (children || [])
            .filter(Boolean)
            .map((item: any, i: number) => {
              const { key, label, initValue } = item || {};
              console.log('Form item', item);
              const itemProps = {
                name: key,
                label,
                initialValue: initValue,
              };
              const colProps: any = {
                xs: 24,
                sm: 12,
                lg: 8,
                xl: 8,
              };
              colProps.onClick = (e: any) =>
                handleComponentClick(e, item, uuid, i);
              return (
                <Col key={i} {...colProps}>
                  <Form.Item {...itemProps}>
                    {(item.children || [])
                      .filter(Boolean)
                      .map((item: any, j: number) =>
                        generateComponent(item, uuid, j),
                      )}
                  </Form.Item>
                </Col>
              );
            });
          return (
            <div
              onClick={(e: any) =>
                handleComponentClick(e, componentDSL, parentUuid, index)
              }
            >
              <Form {...props} onFinish={() => {}}>
                <Row gutter={24}>{formNodes}</Row>
              </Form>
            </div>
          );
        case 'Table':
          const Table = antd['Table'];
          const columns = (children || []).filter(Boolean).map((item: any) => {
            return {
              ...item,
              title: item.label,
              dataIndex: item.key,
            };
          });
          return (
            <div
              onClick={(e: any) =>
                handleComponentClick(e, componentDSL, parentUuid, index)
              }
            >
              <Table columns={columns} dataSource={[]}></Table>
            </div>
          );
        case 'Pagination':
          const Pagination = antd['Pagination'];
          return (
            <div
              className={styles['flex-end']}
              onClick={(e: any) =>
                handleComponentClick(e, componentDSL, parentUuid, index)
              }
            >
              <Pagination />
            </div>
          );
        case 'Select':
          const Select = antd['Select'];
          const { Option } = Select;
          return (
            <Select {...props}>
              {options.map((item: any) => (
                <Option value={item.value}>{item.label}</Option>
              ))}
            </Select>
          );
        case 'Cascader':
          const Cascader = antd['Cascader'];
          const cascaderProps = {
            ...props,
            options,
          };
          return <Cascader {...cascaderProps}></Cascader>;
        case 'RangePicker':
          const DatePicker = antd['DatePicker'];
          const { RangePicker } = DatePicker;
          return <RangePicker {...props} />;
        default:
          return React.createElement(
            antd[componentName],
            { ...props },
            children,
          );
      }
    };
    if (componentName) {
      const key = getUid();
      return <Fragment key={key}>{recursionParser()}</Fragment>;
    }
    return null;
  };
  return (
    <div className={styles['container']}>
      {generateComponent(appContext.state.dsl, null, 0)}
      <SelectBox
        style={selectStyle}
        handleCB={(action: string) => handleOptCB(action)}
      />
    </div>
  );
};

export default Parser;
