import { Button, Form, Input, message, Modal, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { columns } from './data';
import { IFormData, initFormData, initTableRow, ITableRow } from './type';
import moment from 'moment';
import { exportExcelJson } from '@/utils/createExcel';
import { ColumnsType } from 'antd/es/table/InternalTable';
import { ColumnGroupType } from 'antd/es/table/interface';

type LayoutType = Parameters<typeof Form>[0]['layout'];

const MoneyCal = () => {
  const [form] = Form.useForm<IFormData>();
  const formLayout: LayoutType = 'horizontal';
  const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
  const { getFieldsValue, setFieldsValue, validateFields } = form;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState<ITableRow[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<ITableRow[]>([]);
  const [monthlyAttendanceDays, setMonthlyAttendanceDays] = useState('');
  const daysList = useRef<{ label: string; value: string }[]>([]);
  const finalColumns = useRef<ColumnsType<any>>([]);

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
  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: ITableRow[],
  ) => {
    setSelectedRows(selectedRows);
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
      workDay: record.workDay,
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
  const exportExcelFunc = () => {
    let exportData = dataSource;
    if (selectedRowKeys.length) {
      exportData = selectedRows;
    }

    exportExcelJson({
      data: exportData.map((item) => {
        delete item.id;
        delete item.allWorkDay;
        delete item.perTransPrice;
        delete item.mealSupplementStandard;

        return {
          ...item,
          monthlyAttendanceDays: monthlyAttendanceDays,
        };
      }),
      columns: formatColumnsData(finalColumns.current),
    });
  };

  // 获取columns表头数据
  const getColumnsData = (columnsArr: ColumnsType<any>) => {
    finalColumns.current = columnsArr;
  };

  // 格式化columns表头数据
  const formatColumnsData = (allColumnsData: ColumnsType<any>) => {
    let columnsData: ColumnsType<any> = [];
    allColumnsData.forEach((item) => {
      if ((item as any).children) {
        const partColumnsData = formatColumnsData((item as any).children);
        columnsData = [...columnsData, ...partColumnsData];
      }

      if (!item.render && (item as any).dataIndex) {
        columnsData.push({
          title: React.isValidElement(item.title) ? '月应出勤天数' : item.title,
          dataIndex: (item as any).dataIndex,
        });
      }
    });

    return columnsData;
  };

  // 添加工资弹窗打开
  const addWages = () => {
    setIsModalOpen(true);
  };

  // 确认添加工资
  const handleOk = async () => {
    try {
      const val = await validateFields();
      console.log('val', val);

      const formParms: IFormData = getFieldsValue();
      const {
        baseWages,
        allWorkDay,
        workDay: truWorkDay,
        perTransPrice,
        overTimeWages,
        workAgeSubsidy,
        otherSubsidy,
        mealSupplementStandard,
        jobPerformanceSubsidy,
      } = formParms;
      const tableData = [...dataSource];

      // 基本部分合计
      const baseWagesSum =
        (Number(baseWages) / Number(allWorkDay)) * Number(truWorkDay);

      // 绩效部分合计
      const jobPerformanceSum = Number(jobPerformanceSubsidy ?? 0) + 0;

      // 午餐补助
      const lunchSubsidy =
        Number(truWorkDay) *
        Number(mealSupplementStandard ? mealSupplementStandard : 0);

      // 累计交通费
      let transSubsidy = 0;

      // 补助合计
      const subsidySum =
        Number(transSubsidy) +
        lunchSubsidy +
        Number(overTimeWages ?? 0) +
        Number(workAgeSubsidy ?? 0) +
        Number(otherSubsidy ?? 0);

      // 出勤栏合计
      const deductWagesSum = 0;

      // 实发工资
      const finallyWages =
        baseWagesSum + jobPerformanceSum + subsidySum + deductWagesSum;

      tableData.push({
        ...initTableRow,
        id: new Date().getTime(),
        ...formParms,
        subsidySum: subsidySum,
        jobPerformanceSubsidy,
        jobPerformanceSum,
        baseWagesSum: baseWagesSum,
        lunchSubsidy: lunchSubsidy,
        transSubsidy: transSubsidy,
        deductWagesSum,
        finallyWages,
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
      <Button type="primary" onClick={exportExcelFunc}>
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
          getColumnsData,
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
            <Input className="custom_input" type="number" />
          </Form.Item>
          <Form.Item
            label="实际出勤天数"
            name={'workDay'}
            key="workDay"
            rules={[{ required: true }]}
          >
            <Input className="custom_input" type="number" />
          </Form.Item>
          <Form.Item
            label="基本工资"
            name={'baseWages'}
            key="baseWages"
            rules={[{ required: true }]}
          >
            <Input className="custom_input" type="number" />
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
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="加班薪资"
            name={'overTimeWages'}
            key="overTimeWages"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="工龄补助"
            name={'workAgeSubsidy'}
            key="workAgeSubsidy"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item label="其他补助" name={'otherSubsidy'} key="otherSubsidy">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MoneyCal;
