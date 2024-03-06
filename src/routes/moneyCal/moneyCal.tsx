import { Button, Form, Input, Modal, Table } from 'antd';
import { useState } from 'react';
import { columns } from './data';
import { IFormData, initFormData, initTableRow, ITableRow } from './type';

type LayoutType = Parameters<typeof Form>[0]['layout'];

const MoneyCal = () => {
  const [dataSource, setDataSource] = useState<ITableRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>('horizontal');
  const { getFieldsValue } = form;

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  const formItemLayout =
    formLayout === 'horizontal'
      ? { labelCol: { span: 4 }, wrapperCol: { span: 14 } }
      : null;

  // 添加工资
  const addWages = () => {
    setIsModalOpen(true);
  };

  // 确认添加工资
  const handleOk = () => {
    const formParms: IFormData = getFieldsValue();
    const { baseWages, allWorkDay, truWorkDay, perTransPrice } = formParms;
    const tableData = [...dataSource];
    const baseWagesSum =
      (Number(baseWages) / Number(allWorkDay)) * Number(truWorkDay);
    const lunchSubsidy = Number(truWorkDay) * 15;
    let transSubsidy = Number(truWorkDay) * 2 * Number(perTransPrice);
    // 要累积交通费
    if (transSubsidy >= 50) {
      transSubsidy = Number(truWorkDay) * 2 * Number(perTransPrice) * 0.8;
    } else if (transSubsidy >= 100) {
      transSubsidy = Number(truWorkDay) * 2 * Number(perTransPrice) * 0.5;
    }

    tableData.push({
      ...initTableRow,
      ...formParms,
      baseWagesSum: baseWagesSum,
      lunchSubsidy: lunchSubsidy,
      transSubsidy: transSubsidy,
    });

    setDataSource([...tableData]);
    handleCancel()
  };

  // 取消弹窗
  const handleCancel = () => {
    setIsModalOpen(false);
    form.setFieldsValue({ ...initFormData });
  };

  return (
    <>
      <br />
      <Button type="primary" onClick={addWages}>
        添加工资
      </Button>
      <br />
      <br />
      <Table
        bordered
        size="middle"
        pagination={false}
        scroll={{ x: 2500 }}
        dataSource={dataSource}
        columns={columns()}
      />

      {/* 添加工资弹窗 */}
      <Modal
        width={600}
        title="添加工资"
        open={isModalOpen}
        destroyOnClose={true}
        maskClosable={false}
        okText="开始计算"
        cancelText="取消"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          {...formItemLayout}
          layout={formLayout}
          form={form}
          initialValues={{ layout: formLayout }}
          onValuesChange={onFormLayoutChange}
          style={{ maxWidth: formLayout === 'inline' ? 'none' : 600 }}
        >
          <Form.Item label="所属项目" name={'project'} key="project">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item label="姓名" name={'name'} key="name">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item label="应出勤天数" name={'allWorkDay'} key="allWorkDay">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item label="实际出勤天数" name={'truWorkDay'} key="truWorkDay">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item label="基本工资" name={'baseWages'} key="baseWages">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item
            label="每次交通费"
            name={'perTransPrice'}
            key="perTransPrice"
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item
            label="绩效补助"
            name={'jobPerformanceSubsidy'}
            key="jobPerformanceSubsidy"
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item
            label="工龄补助"
            name={'workAgeSubsidy'}
            key="workAgeSubsidy"
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item label="其他补助" name={'otherSubsidy'} key="otherSubsidy">
            <Input placeholder="input placeholder" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MoneyCal;
