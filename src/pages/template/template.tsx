import React from 'react'
import { Button, Input, Form, Table, Row, Col } from 'antd'
import { FormInstance } from 'antd/lib/form'
import UmiRequest from '@du/umi-request'

export default class Index extends React.Component {
  state = {
    colProps: {
      xs: 24,
      sm: 12,
      lg: 12,
      xl: 6,
    },
    list: [],
    form: {},
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    columns: [
      {
        key: 'id',
        dataIndex: 'id',
        title: '序号',
        minWidth: 100,
      },
      {
        key: 'orderNo',
        dataIndex: 'orderNo',
        title: '订单号',
      },
      {
        key: 'trueName',
        dataIndex: 'trueName',
        title: '姓名',
      },
      {
        key: 'buyerIdCardNo',
        dataIndex: 'buyerIdCardNo',
        title: '身份证号',
      },
      {
        key: 'amount',
        dataIndex: 'amount',
        title: '订单金额',
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: '校验状态',
      },
      {
        key: 'createTime',
        dataIndex: 'createTime',
        title: '创建时间',
      },
      {
        key: 'modifyTime',
        dataIndex: 'modifyTime',
        title: '修改时间',
      },
    ]
  }

  

  formRef = React.createRef<FormInstance>()

  componentDidMount() {
    this.queryList()
  }

  queryList() {
    const { form, pagination } = this.state
    const params: any = Object.assign({}, { ...form }, {
      pageSize: pagination.pageSize,
      page: pagination.current,
    })
    Object.keys(params).forEach((k) => {
      if (params[k] === undefined ) {
        delete params[k]
      }
    })
    UmiRequest.request({
      url: 'https://www.fastmock.site/mock/41f5b931f7e17899ab753d8731c543d5/api/order/list',
      params,
    }).then((res: any) => {
      if (res.code === 200) {
        this.setState({
          list: res.data.rows,
          pagination: {
            ...pagination,
            total: res.data.total
          }
        })
      }
    })
  }

  submit(values: any) {
    this.setState({
      form: values,
      pagination: {
        ...this.state.pagination,
        current: 1
      }
    }, () => this.queryList())
  }

  reset() {
    this.formRef.current!.resetFields()
    this.setState({
      form: {},
      pagination: {
        ...this.state.pagination,
        current: 1
      }
    }, () => this.queryList())
  }

  handleTableChange(p: any) {
    this.setState({
      pagination: p
    }, () => this.queryList())
  }

  render() {
    const { pagination, list, colProps, columns } = this.state
    return (
      <div className="main-container">
        <Form 
          labelCol={{ span: 8 }} 
          wrapperCol={{ span: 16 }} 
          ref={this.formRef} 
          onFinish={this.submit.bind(this)}
        >
          <Row gutter={24}>
            <Col {...colProps}>
              <Form.Item label="姓名" name="trueName">
                <Input />
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <Form.Item label="身份证" name="buyerIdCardNo">
                <Input />
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <Form.Item label="订单号" name="orderNo">
                <Input />
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <Form.Item
                label=""
                wrapperCol={{ span: 16, offset: 8 }}
              >
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
                <Button
                  style={{ margin: '0 8px' }}
                  onClick={this.reset.bind(this)}
                >
                  重置
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          dataSource={list}
          onChange={this.handleTableChange.bind(this)}
          pagination={
            {
              ...pagination,
              showTotal: (s: any) => `共 ${s} 条`,
              showSizeChanger: false
            }
          }
        >
        </Table>
      </div>
    )
  }
}