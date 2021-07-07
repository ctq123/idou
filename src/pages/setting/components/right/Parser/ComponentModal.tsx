/*
 * @Author: chengtianqing
 * @Date: 2021-07-03 01:17:49
 * @LastEditTime: 2021-07-07 00:06:16
 * @LastEditors: chengtianqing
 * @Description:
 */
import { useState } from 'react';
import { Modal, Button, Input, message } from 'antd';
import { ModuleComponents } from '../../../const/componentDSL';
import styles from './ComponentModal.less';

interface IProps {
  visible: boolean;
  handleCB?: any;
}

const { Search } = Input;

const ComponentModal = (props: IProps) => {
  const { handleCB } = props;
  const [list, setList] = useState(ModuleComponents);
  const [selectedItem, setSelectedItem] = useState(null) as any;

  const handleSave = () => {
    if (!selectedItem) {
      message.warning('请选择组件');
      return;
    }
    const com = selectedItem.componentDSL;
    handleCB && handleCB({ visible: false, com });
  };
  const handleCancel = () => {
    handleCB && handleCB({ visible: false });
  };

  const handleOnSearch = (val: any) => {
    if (val) {
      const arr = ModuleComponents.filter(({ key, name }: any) =>
        [key, name].some((t) => t.indexOf(val) > -1),
      );
      setList(arr);
    } else {
      setList(ModuleComponents);
    }
  };

  return (
    <Modal
      title={'组件列表'}
      visible={props.visible}
      onCancel={() => handleCancel()}
      onOk={() => handleSave()}
      footer={[
        <Button key="back" onClick={() => handleCancel()}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => handleSave()}>
          确定
        </Button>,
      ]}
    >
      <div className={styles['modal-content']}>
        <Search
          placeholder="请输入搜索"
          allowClear
          enterButton="搜索"
          size="middle"
          onSearch={handleOnSearch}
          onChange={(e) => handleOnSearch(e.target.value)}
        />
        <div className={styles['component']}>
          {(list || []).map((item: any) => (
            <div
              key={item.key}
              className={
                selectedItem && item.key === selectedItem.key
                  ? `${styles['active-item']} ${styles['item']}`
                  : styles['item']
              }
              onClick={() => setSelectedItem(item)}
            >
              <img
                alt="图片"
                src={
                  'https://cdn.poizon.com/node-common/c6780a17e71588e6fd40054d541969e8.png'
                }
              />
              <div>
                <h3>{item.key}</h3>
                <div>{item.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ComponentModal;
