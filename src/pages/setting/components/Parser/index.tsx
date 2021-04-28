import React, { Fragment, useState } from 'react';
import { v1 } from 'uuid';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
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

interface Iprops {
  dsl: DSL;
}

const Parser = (props: Iprops) => {
  const [selectStyle, setSelectStyle] = useState({});

  const handleComponentClick = (e: any) => {
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
    } catch (e) {}
  };
  const generateComponent = (componentDSL: IComponent) => {
    const { componentName, children, props } = componentDSL;
    const recursionParser = () => {
      switch (componentName) {
        case 'Page':
          const childNodes = (children || []).map((item: any) =>
            generateComponent(item),
          );
          return <div className={styles['page']}>{childNodes}</div>;
        case 'Form':
          const Form = antd['Form'];
          const Row = antd['Row'];
          const Col = antd['Col'];
          const formNodes = (children || []).map((item: any, i: number) => {
            const { key, label, initValue } = item || {};
            const itemProps = {
              name: key,
              label,
              initialValue: initValue,
            };
            const colProps = {
              xs: 24,
              sm: 12,
              lg: 8,
              xl: 8,
            };
            return (
              <Col
                key={i}
                {...colProps}
                onClick={(e: any) => handleComponentClick(e)}
              >
                <Form.Item {...itemProps}>
                  {(item.children || []).map((item: any) =>
                    generateComponent(item),
                  )}
                </Form.Item>
              </Col>
            );
          });
          return (
            <div onClick={(e: any) => handleComponentClick(e)}>
              <Form {...props} onFinish={() => {}}>
                <Row gutter={24}>{formNodes}</Row>
              </Form>
            </div>
          );
        case 'Table':
          const Table = antd['Table'];
          const columns = (children || []).map((item: any) => {
            return {
              ...item,
              title: item.label,
              dataIndex: item.key,
            };
          });
          return (
            <div onClick={(e: any) => handleComponentClick(e)}>
              <Table
                columns={columns}
                dataSource={[]}
                pagination={{
                  current: 1,
                  pageSize: 20,
                  total: 0,
                  showTotal: (s: any) => `共 ${s} 条`,
                  showSizeChanger: false,
                }}
              ></Table>
            </div>
          );
        default:
          const newProps = {
            ...props,
          };
          return React.createElement(antd[componentName], newProps, children);
      }
    };
    if (componentName) {
      const key = v1();
      return <Fragment key={key}>{recursionParser()}</Fragment>;
    }
    return null;
  };
  return (
    <div className={styles['container']}>
      {generateComponent(props.dsl)}
      <div className={styles['select-box']} style={selectStyle}>
        <div className={styles['top']}>
          <span title="上移">
            <ArrowUpOutlined />
          </span>
          <span title="下移">
            <ArrowDownOutlined />
          </span>
          <span title="复制">
            <CopyOutlined />
          </span>
          <span title="删除">
            <DeleteOutlined />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Parser;
