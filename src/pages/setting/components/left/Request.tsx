import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import CodeDrawer from '../codeEditor/CodeDrawer';

const methods = ['GET', 'POST', 'PUT', 'DELETE'];
const Option = Select.Option;

const Request = (props: any) => {
  const { apis } = props.dsl || {};
  const [visible, setVisible]: any = useState(false);
  const [codeStr, setCodeStr]: any = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (apis) {
      let method = 'POST',
        url = '';
      let codeStr = Object.keys(apis).reduce((pre, cur): any => {
        let str = '';
        if (cur === 'imports') {
          str = Object.entries(apis.imports)
            .map(([k, v]) => `import ${k} from "${v}";`)
            .join('\n');
          str += '\n';
        } else {
          str = `${apis[cur]}`;
          if (!url) {
            let s = str;
            let [, urlstr] = s.split('url:');
            if (urlstr) {
              urlstr = urlstr.substr(0, urlstr.indexOf(',')) || '';
              urlstr = urlstr.replace(/['"]/g, '');
              url = urlstr.trim();
            }
            let [, m] = s.split('method:');
            if (m) {
              m = m.substr(0, m.indexOf(',')) || '';
              m = m.replace(/['"]/g, '');
              if (m.trim()) {
                method = m.trim().toLocaleUpperCase();
              }
            }
          }
        }
        return pre + str + '\n';
      }, '');
      form.setFieldsValue({
        method,
        url,
      });
      setCodeStr(codeStr);
    }
  }, [apis]);

  const onFinish = (values: any) => {
    console.log('Success:', values);
    const newApis = { ...apis };
    // 提取第一个api函数字符串，并进行更换其中的url和method方法
    const tKey = Object.keys(newApis).find((k) => k !== 'imports') || '';
    let target = newApis[tKey];
    if (target && target.indexOf('url:') > -1) {
      // 存在url才认为合法
      let s = target;
      let urlPositon = [],
        methodPosition = [];
      urlPositon.push(s.indexOf('url:') + 4);
      let [, url2] = s.split('url:');
      urlPositon.push(url2.indexOf(','));
      let oldUrl = s.substr(urlPositon[0], urlPositon[1]);
      let oldMethod = '';
      if (s.indexOf('method:')) {
        // 存在method字段
        methodPosition.push(s.indexOf('method:') + 7);
        let [, m2] = s.split('method:');
        methodPosition.push(m2.indexOf(','));
        oldMethod = s.substr(methodPosition[0], methodPosition[1]);
      }
      oldUrl = oldUrl.trim().replace(/['"]/g, '');
      oldMethod = oldMethod.trim().replace(/['"]/g, '');
      target = s.replace(oldUrl, values.url);
      if (oldMethod) {
        target = target.replace(oldMethod, values.method);
      } else {
        // 不存在method字段，直接插入
        target =
          target.slice(0, urlPositon[0]) +
          `method: ${values.method},\n` +
          s.slice(urlPositon[0]);
      }
      // console.log("target", target)
      newApis[tKey] = target;
    }
    props.handleCB && props.handleCB(newApis);
    message.success('更新成功！');
  };

  const handleApisCodeCB = (obj: any) => {
    const { visible, code } = obj;
    let newCode = code;
    setVisible(visible);
    if (newCode && newCode.trim()) {
      let apis: any = {};
      newCode.split('function').forEach((item: any, i: number) => {
        if (i === 0) {
          let imports: any = {};
          (item || '').split('\n').forEach((line: any) => {
            if (
              line &&
              line.indexOf('import') > -1 &&
              line.indexOf('from') > -1
            ) {
              line = line.substr(line.indexOf('import') + 6);
              let [k, v] = line
                .split('from')
                .map((s: any) => (s ? s.trim() : ''))
                .filter(Boolean);
              if (v) {
                v = v.replace(/['";]/g, '');
              }
              imports[k] = v;
            }
          });
          apis.imports = imports;
        } else {
          let funcName =
            item.substr(0, item.indexOf('(')).trim() || `funcName${i}`;
          apis[funcName] = `function${item}`;
        }
      });
      // console.log("apis", apis)
      props.handleCB && props.handleCB(apis);
      message.success('保存成功！');
    }
  };

  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  };

  return (
    <>
      <Form {...layout} form={form} size="small" onFinish={onFinish}>
        <Form.Item
          name="method"
          rules={[{ required: true, message: '请选择方法类型' }]}
        >
          <Select style={{ width: '100%' }} allowClear placeholder="方法类型">
            {methods.map((k, i) => (
              <Option key={k} value={k}>
                {k}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="url"
          rules={[{ required: true, message: '请输入url' }]}
        >
          <Input placeholder="请输入url" allowClear />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            type="primary"
            danger
            onClick={() => setVisible(true)}
          >
            代码编辑
          </Button>
        </Form.Item>
      </Form>
      <CodeDrawer
        value={codeStr}
        visible={visible}
        type={'function'}
        handleCB={(val: any) => handleApisCodeCB(val)}
      />
    </>
  );
};

export default Request;
