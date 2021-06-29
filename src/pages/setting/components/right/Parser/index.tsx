// @ts-nocheck
import React, { Fragment, useContext, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import SelectBox from '../SelectBox';
import { Context } from '@/pages/setting/model';
import { getUid } from '@/utils';
import { getMockDataList } from '@/utils/mock';
import styles from './index.less';
import 'antd/dist/antd.css';
import { Button, Divider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

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
  const [mockList, setMockList] = useState([]);
  const [cols, setCols] = useState(cols);
  const [newDSL, setNewDSL] = useState({});
  const [dataSource, setDataSource] = useState({});

  useEffect(() => {
    const newDSL = cloneDeep(appContext.state.dsl);
    const { dataSource = {} } = newDSL || {};
    setDataSource(dataSource);
    setNewDSL(newDSL);
  }, [appContext.state.dsl]);
  useEffect(() => {
    setSelectStyle({});
  }, [appContext.state.dslType]);

  // 模拟数据
  const getMockData = (columns) => {
    let data = {};
    if (!columns || !columns.length) {
      setMockList([]);
      setCols(data);
      return;
    }
    columns.forEach((item) => {
      if (item.dataIndex !== '-') {
        data[item.dataIndex] = item.title;
      }
    });
    // console.log('cols,data', cols, data);
    if (isEqual(cols, data)) return;
    setCols(data);
    getMockDataList(data)
      .then((res) => setMockList(res))
      .catch((e) => setMockList([]));
  };

  // console.log('Parser, state', appContext.state);
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
      // console.log('rect item', rect, item);
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

  const getClassNameStr = (props: any) => {
    const { className } = props || {};
    const classStr = (className || '')
      .split(' ')
      .filter(Boolean)
      .reduce((pre, c) => (pre ? `${pre} ${styles[c]}` : styles[c]), '');
    return classStr;
  };

  const getDomName = (componentType: any, componentName: string) => {
    // TODO 特殊处理div
    if (['modal', 'div'].includes(componentName.toLowerCase())) {
      return 'div';
    }
    switch (componentType) {
      case 'native':
        return componentName.toLowerCase();
      case 'custom':
        return componentName;
      default:
        return antd[componentName];
    }
  };

  const generateComponent = (
    componentDSL: IComponent,
    parentUuid: any,
    index: number,
  ) => {
    const {
      componentName,
      children,
      props,
      uuid,
      options = [],
      isEdit,
      dataKey,
      componentType,
    } = componentDSL;
    const recursionParser = () => {
      switch (componentName) {
        case 'Form':
          const Form = antd['Form'];
          const Row = antd['Row'];
          const Col = antd['Col'];
          const formNodes = (children || [])
            .filter(Boolean)
            .map((item: any, i: number) => {
              const { key, label, initialValue } = item || {};
              // console.log('Form item', item);
              const itemProps = {
                name: key,
                label,
                initialValue: initialValue,
              };
              const colProps: any = dataSource.colProps || {};
              // if (key) {
              //   colProps.onClick = (e: any) =>
              //     handleComponentClick(e, item, uuid, i);
              // }

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
            const col = {
              title: item.label,
              dataIndex: item.key,
            };
            if (item.label === '操作') {
              col.render = () => {
                return (
                  <>
                    <a>查看</a>
                    <Divider type="vertical"></Divider>
                    <a>编辑</a>
                  </>
                );
              };
            }
            if (Array.isArray(item.children)) {
              col.render = () => {
                return generateComponent(item.children[0], uuid, 0);
              };
            }
            return col;
          });
          // 动态生成mock数据
          getMockData(columns);
          // console.log('mockList', mockList);
          return (
            <div
              onClick={(e: any) =>
                handleComponentClick(e, componentDSL, parentUuid, index)
              }
            >
              <Table
                columns={columns}
                dataSource={mockList}
                pagination={false}
              ></Table>
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
        case 'Row':
          const Row2 = antd['Row'];
          const Col2 = antd['Col'];
          const rowProps = { ...props };
          if (isEdit) {
            rowProps.onClick = (e: any) =>
              handleComponentClick(e, componentDSL, parentUuid, index);
          }
          const colChilds = (children || [])
            .filter(Boolean)
            .map((item: any, i: number) => {
              if (item.componentName) {
                return generateComponent(item, uuid, i);
              } else {
                if (item) {
                  return (
                    <Col2 span={item.span}>
                      <span>{item.label}：</span>
                      {item.key}
                    </Col2>
                  );
                } else {
                  return null;
                }
              }
            })
            .filter(Boolean);
          return <Row2 {...rowProps}>{colChilds}</Row2>;
        case 'CrumbBack':
          // const title: any = dataSource.title || '';
          const crumbbackProps = { ...props };
          if (isEdit) {
            crumbbackProps.onClick = (e: any) =>
              handleComponentClick(e, componentDSL, parentUuid, index);
          }
          return (
            <div {...crumbbackProps} className={styles['go-back']}>
              <i>
                <ArrowLeftOutlined />
              </i>{' '}
              <span className={styles['bread']}>{children || ''}</span>
            </div>
          );
        case 'StatusTag':
          const Tag = antd['Tag'];
          const { statusObj = {} } = props;
          const k = Object.keys(statusObj).find((_, i) => i === 0);
          const target = statusObj[k];
          return target ? <Tag color={target.tag}>{target.value}</Tag> : null;
        case 'Button':
          // 转换属性
          if (props.type === 'text') {
            props.type = 'link';
          }
        case 'Divider':
          // 转换属性
          if (props.direction) {
            props.type = props.direction;
          }
        default:
          const defaultProps = { ...props };
          const className = getClassNameStr(defaultProps);
          if (className) {
            defaultProps.className = className;
          }
          if (isEdit) {
            defaultProps.onClick = (e: any) =>
              handleComponentClick(e, componentDSL, parentUuid, index);
          }
          const defaultChildren = Array.isArray(children)
            ? children
                .filter(Boolean)
                .map((item: any, i: number) => generateComponent(item, uuid, i))
            : children;
          const eleName = getDomName(componentType, componentName);
          return React.createElement(eleName, defaultProps, defaultChildren);
      }
    };
    if (componentName) {
      const key = getUid();
      if (componentName === 'Modal') {
        return (
          <div className={styles['modal']} key={key}>
            <span className={styles['modal-close']}>X</span>
            <div className={styles['header-line']}></div>
            {recursionParser()}
          </div>
        );
      }
      return <Fragment key={key}>{recursionParser()}</Fragment>;
    }
    return null;
  };

  return (
    <div className={styles['container']}>
      {generateComponent(newDSL, null, 0)}
      <SelectBox
        style={selectStyle}
        handleCB={(action: string) => handleOptCB(action)}
      />
    </div>
  );
};

export default Parser;
