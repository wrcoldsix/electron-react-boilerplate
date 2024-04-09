import { Button, Form, Input, message, Modal, Table } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { columns } from './data';
import { IFormData, initFormData, initTableRow, ITableRow } from './type';
import moment from 'moment';

type LayoutType = Parameters<typeof Form>[0]['layout'];

const MoneyCal = () => {
  const [form] = Form.useForm<IFormData>();
  const formLayout: LayoutType = 'horizontal';
  const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
  const { getFieldsValue, setFieldsValue, validateFields } = form;

  const [dataSource, setDataSource] = useState<ITableRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [monthlyAttendanceDays, setMonthlyAttendanceDays] = useState('');
  const daysList = useRef<{ label: string; value: string }[]>([]);

  useEffect(() => {
    setDaysListData();
  }, []);

  // 设置日期下拉菜单数据
  const setDaysListData = () => {
    const daysListArr: { label: string; value: string }[] = [];
    for (let i = 1; i <= moment().daysInMonth(); i++) {
      daysListArr.push({ value: i.toString(), label: i.toString() });
    }

    daysList.current = [...daysListArr];
  };

  // 处理月出勤天数change事件
  const handleMonthlyAttendanceDaysChange = (e: string) => {
    setMonthlyAttendanceDays(e);
  };

  // 处理多选框change事件
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 编辑操作
  const edit = (record: ITableRow) => {
    setIsModalOpen(true);
    setFieldsValue({
      project: record.project,
      name: record.name,
      allWorkDay: record.allWorkDay,
      truWorkDay: record.truWorkDay,
      baseWages: record.baseWages,
      perTransPrice: record.perTransPrice,
      jobPerformanceSubsidy: record.jobPerformanceSubsidy,
      workAgeSubsidy: record.workAgeSubsidy,
      otherSubsidy: record.otherSubsidy,
      mealSupplementStandard: record.mealSupplementStandard,
      overTimeWages: record.overTimeWages,
    });
  };

  // 删除操作
  const del = (record: ITableRow) => {
    const tableData = dataSource.filter((item) => item.id !== record.id);

    setDataSource([...tableData]);
  };

  // 导出
  const exportExcel = () => {
    if (!selectedRowKeys.length) {
      console.log('默认导出全部');
    } else {
      console.log('导出选中内容文件');
    }
  };

  // 添加工资弹窗打开
  const addWages = () => {
    setIsModalOpen(true);
  };

  // 确认添加工资
  const handleOk = async () => {
    try {
      const val = await validateFields();
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
        id: new Date().getTime(),
        ...formParms,
        baseWagesSum: baseWagesSum,
        lunchSubsidy: lunchSubsidy,
        transSubsidy: transSubsidy,
      });

      setDataSource([...tableData]);
      handleCancel();
    } catch (error) {
      console.log('error', error);
    }
  };

  // 取消弹窗
  const handleCancel = () => {
    setIsModalOpen(false);
    setFieldsValue({ ...initFormData });
  };

  return (
    <>
      <br />
      <Button type="primary" onClick={addWages}>
        添加工资
      </Button>
      &nbsp;&nbsp;
      <Button type="primary" onClick={exportExcel}>
        导出
      </Button>
      <br />
      <br />
      <Table
        bordered
        rowKey="id"
        size="small"
        pagination={false}
        scroll={{ x: 2500 }}
        dataSource={dataSource}
        rowSelection={rowSelection}
        columns={columns({
          daysList: daysList.current,
          monthlyAttendanceDays,
          edit,
          del,
          handleMonthlyAttendanceDaysChange,
        })}
      />
      {/* 添加工资弹窗 */}
      <Modal
        width={500}
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
          form={form}
          layout={formLayout}
          style={{ maxWidth: 600 }}
          initialValues={{ layout: formLayout }}
        >
          <Form.Item
            label="所属项目"
            name={'project'}
            key="project"
            rules={[{ required: true }]}
          >
            <Input className="custom_input" />
          </Form.Item>
          <Form.Item
            label="姓名"
            name={'name'}
            key="name"
            rules={[{ required: true }]}
          >
            <Input className="custom_input" />
          </Form.Item>
          <Form.Item
            label="应出勤天数"
            name={'allWorkDay'}
            key="allWorkDay"
            rules={[{ required: true }]}
          >
            <Input className="custom_input" />
          </Form.Item>
          <Form.Item
            label="实际出勤天数"
            name={'truWorkDay'}
            key="truWorkDay"
            rules={[{ required: true }]}
          >
            <Input className="custom_input" />
          </Form.Item>
          <Form.Item
            label="基本工资"
            name={'baseWages'}
            key="baseWages"
            rules={[{ required: true }]}
          >
            <Input className="custom_input" />
          </Form.Item>
          <Form.Item
            label="实际交通费（次）"
            name={'perTransPrice'}
            key="perTransPrice"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="餐补标准"
            name={'mealSupplementStandard'}
            key="mealSupplementStandard"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="绩效补助"
            name={'jobPerformanceSubsidy'}
            key="jobPerformanceSubsidy"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="加班薪资"
            name={'overTimeWages'}
            key="overTimeWages"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="工龄补助"
            name={'workAgeSubsidy'}
            key="workAgeSubsidy"
          >
            <Input />
          </Form.Item>
          <Form.Item label="其他补助" name={'otherSubsidy'} key="otherSubsidy">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MoneyCal;
