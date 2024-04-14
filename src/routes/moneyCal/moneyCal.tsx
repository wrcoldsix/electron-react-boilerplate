import { Button, Form, Input, message, Modal, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { columns } from './data';
import { IFormData, initFormData, initTableRow, ITableRow } from './type';
import moment from 'moment';
import { exportExcelJson } from '@/utils/createExcel';
import { ColumnsType } from 'antd/es/table/InternalTable';

type LayoutType = Parameters<typeof Form>[0]['layout'];

const MoneyCal = () => {
  const [form] = Form.useForm<IFormData>();
  const formLayout: LayoutType = 'horizontal';
  const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
  const { getFieldsValue, setFieldsValue, validateFields, resetFields } = form;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState<ITableRow[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<ITableRow[]>([]);
  const [monthlyAttendanceDays, setMonthlyAttendanceDays] = useState('');
  const operaType = useRef('add');
  const currentId = useRef<number | null>(null);
  const currentIndex = useRef(-1);
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

  // 编辑或删除一条数据，交通补贴重新计算逻辑整合
  const operaTransSubsidy = (record: ITableRow, index: number) => {
    let tableData: ITableRow[] = [];
    const sameNameData = dataSource
      .filter((item) => item.id !== record.id)
      .filter((item) => item.name === record.name);

    if (sameNameData.length) {
      let baseNumber = dataSource
        .filter((item, ind) => ind < index && item.name === record.name)
        .reduce((count, item) => {
          return Number(count) + Number(item.transSubsidy);
        }, 0);

      tableData = dataSource.map((item, ind) => {
        if (ind > index && item.name === record.name) {
          // 交通补贴
          const transSubsidy = transSubsidyCalcu({
            truWorkDay: item.workDay,
            perTransPrice: item.perTransPrice || 0,
            baseNumber,
          });

          // 补助合计
          const subsidySum =
            Number(item.subsidySum) - Number(item.transSubsidy) + transSubsidy;

          // 实发工资
          const finallyWages =
            Number(item.finallyWages) - Number(item.subsidySum) + subsidySum;

          return {
            ...item,
            subsidySum,
            transSubsidy,
            finallyWages,
          };
        }

        return item;
      });
    } else {
      tableData = dataSource;
    }

    return [...tableData];
  };

  // 编辑操作
  const edit = (record: ITableRow, index: number) => {
    setIsModalOpen(true);
    operaType.current = 'edit';
    currentId.current = record.id ?? null;
    currentIndex.current = index;
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
  const del = (record: ITableRow, index: number) => {
    let tableData = dataSource.filter((item) => item.id !== record.id);

    if (index !== dataSource.length - 1) {
      tableData = operaTransSubsidy(record, index).filter(
        (item) => item.id !== record.id,
      );
    }

    setDataSource([...tableData]);
  };

  // 相同姓名数据合并计算
  const sameNameDataTotalCalculation = (tableData: ITableRow[]) => {
    // 使用reduce方法合并具有相同name属性的对象
    const merged = tableData.reduce<ITableRow[]>((acc, current) => {
      // 检查acc中是否已有相同name的对象
      const existing = acc.find((item) => item.name === current.name);
      if (existing) {
        // 如果存在，更新value为累加值，并处理remark
        existing.workDay = Number(existing.workDay) + Number(current.workDay);
        existing.overtimeDay =
          Number(existing.overtimeDay) + Number(current.overtimeDay);
        existing.lateOrLeaveEarlyDay =
          Number(existing.lateOrLeaveEarlyDay) +
          Number(current.lateOrLeaveEarlyDay);
        existing.otherVocationDay =
          Number(existing.otherVocationDay) + Number(current.otherVocationDay);
        existing.absenteeismDay =
          Number(existing.absenteeismDay) + Number(current.absenteeismDay);
        existing.baseWages =
          Number(existing.baseWages) + Number(current.baseWages);
        existing.jobPerformance =
          Number(existing.jobPerformance) + Number(current.jobPerformance);
        existing.levelWages =
          Number(existing.levelWages) + Number(current.levelWages);
        existing.baseWagesSum =
          Number(existing.baseWagesSum) + Number(current.baseWagesSum);
        existing.jobPerformancePer =
          Number(existing.jobPerformancePer) +
          Number(current.jobPerformancePer);
        existing.jobPerformanceSubsidy =
          Number(existing.jobPerformanceSubsidy) +
          Number(current.jobPerformanceSubsidy);
        existing.jobPerformanceSum =
          Number(existing.jobPerformanceSum) +
          Number(current.jobPerformanceSum);
        existing.transSubsidy =
          Number(existing.transSubsidy) + Number(current.transSubsidy);
        existing.lunchSubsidy =
          Number(existing.lunchSubsidy) + Number(current.lunchSubsidy);
        existing.overTimeWages =
          Number(existing.overTimeWages) + Number(current.overTimeWages);
        existing.workAgeSubsidy =
          Number(existing.workAgeSubsidy) + Number(current.workAgeSubsidy);
        existing.otherSubsidy =
          Number(existing.otherSubsidy) + Number(current.otherSubsidy);
        existing.subsidySum =
          Number(existing.subsidySum) + Number(current.subsidySum);
        existing.lateOrLeaveEarlyPrice =
          Number(existing.lateOrLeaveEarlyPrice) +
          Number(current.lateOrLeaveEarlyPrice);
        existing.otherVocationPrice =
          Number(existing.otherVocationPrice) +
          Number(current.otherVocationPrice);
        existing.absenteeismPrice =
          Number(existing.absenteeismPrice) + Number(current.absenteeismPrice);
        existing.otherDeductWages =
          Number(existing.otherDeductWages) + Number(current.otherDeductWages);
        existing.deductWagesSum =
          Number(existing.deductWagesSum) + Number(current.deductWagesSum);
        existing.finallyWages =
          Number(existing.finallyWages) + Number(current.finallyWages);
        existing.remark += `;${current.project}项目${current.finallyWages}实发工资`;
      } else {
        // 如果不存在，直接添加到acc中
        current.remark = `${current.project}项目${current.finallyWages}实发工资`;
        acc.push(current);
      }
      return acc;
    }, []);

    return merged;
  };

  // 导出
  const exportExcelFunc = () => {
    let exportData = [...dataSource];

    if (selectedRowKeys.length) {
      exportData = [...selectedRows];
    }

    const columns = formatColumnsData(finalColumns.current);
    columns.push({
      title: '备注',
      dataIndex: 'remark',
    });

    exportExcelJson({
      data: sameNameDataTotalCalculation([...exportData]).map((item) => {
        return {
          ...item,
          monthlyAttendanceDays: monthlyAttendanceDays,
        };
      }),
      columns: columns,
      extraDelColumns: [
        'id',
        'allWorkDay',
        'perTransPrice',
        'mealSupplementStandard',
      ],
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
    operaType.current = 'add';
    setIsModalOpen(true);
    setFieldsValue({
      ...initFormData,
    });
  };

  // 确认添加工资
  const handleOk = async () => {
    try {
      await validateFields();

      const formParms: IFormData = getFieldsValue();
      const {
        name,
        baseWages,
        allWorkDay,
        workDay: truWorkDay,
        perTransPrice: perTransPriceCopy,
        overTimeWages,
        workAgeSubsidy,
        otherSubsidy,
        mealSupplementStandard,
        jobPerformanceSubsidy: jobPerformanceSubsidyCopy,
      } = formParms;
      let tableData = [...dataSource];
      const perTransPrice = perTransPriceCopy ?? 0;
      const jobPerformanceSubsidy = jobPerformanceSubsidyCopy
        ? Number(jobPerformanceSubsidyCopy)
        : 0;

      // 同名信息数据
      const sameData =
        operaType.current === 'add'
          ? tableData.filter((item) => item.name === name)
          : tableData.filter(
              (item) => item.id !== currentId.current && item.name === name,
            );
      const sameDatadWorDays =
        sameData.reduce((count, item) => {
          return Number(count) + (item.workDay ? Number(item.workDay) : 0);
        }, 0) + Number(truWorkDay);
      const sameDataTransSubsidy = sameData.reduce((count, item) => {
        return (
          Number(count) + (item.transSubsidy ? Number(item.transSubsidy) : 0)
        );
      }, 0);

      if (
        sameDatadWorDays > moment().daysInMonth() &&
        operaType.current === 'add'
      )
        return message.error(`${name}所有项目出勤天数超过当前月可出勤天数`);

      // 基本部分合计
      const baseWagesSum =
        (Number(baseWages) / Number(allWorkDay)) * Number(truWorkDay);

      // 绩效部分合计
      const jobPerformanceSum = Number(jobPerformanceSubsidy ?? 0) + 0;

      // 午餐补助
      const lunchSubsidy =
        Number(truWorkDay) *
        Number(mealSupplementStandard ? mealSupplementStandard : 0);

      // 累计交通费计算
      let transSubsidy = 0;
      if (!sameData.length) {
        transSubsidy = transSubsidyCalcu({
          truWorkDay: truWorkDay,
          perTransPrice: perTransPrice,
        });
      } else {
        transSubsidy = transSubsidyCalcu({
          truWorkDay: truWorkDay,
          perTransPrice: perTransPrice,
          baseNumber: sameDataTransSubsidy,
        });
      }

      // 补助合计
      const subsidySum =
        Number(transSubsidy.toFixed(2)) +
        lunchSubsidy +
        Number(overTimeWages ?? 0) +
        Number(workAgeSubsidy ?? 0) +
        Number(otherSubsidy ?? 0);

      // 出勤栏合计
      const deductWagesSum = 0;

      // 实发工资
      const finallyWages =
        baseWagesSum + jobPerformanceSum + subsidySum + deductWagesSum;

      const newTableRow = {
        ...initTableRow,
        ...formParms,
        id: new Date().getTime(),
        subsidySum: Number(Number(subsidySum).toFixed(2)),
        jobPerformanceSubsidy: Number(jobPerformanceSubsidy.toFixed(2)),
        jobPerformanceSum: Number(jobPerformanceSum.toFixed(2)),
        baseWagesSum: Number(baseWagesSum.toFixed(2)),
        lunchSubsidy: Number(lunchSubsidy.toFixed(2)),
        transSubsidy: Number(transSubsidy.toFixed(2)),
        deductWagesSum: Number(deductWagesSum.toFixed(2)),
        finallyWages: Number(finallyWages.toFixed(2)),
      };

      if (operaType.current === 'add') {
        tableData.push({ ...newTableRow });
      } else {
        const newRecord = {
          ...newTableRow,
          id: currentId.current,
        };

        tableData = operaTransSubsidy(newRecord, currentIndex.current).map(
          (item) => {
            if (item.id === currentId.current) {
              return {
                ...item,
                ...newRecord,
              };
            }
            return item;
          },
        );
      }

      setDataSource([...tableData]);
      handleCancel();
    } catch (error) {
      console.log('error', error);
    }
  };

  // 交通补贴计算
  const transSubsidyCalcu = ({
    truWorkDay,
    perTransPrice,
    baseNumber = 0,
  }: {
    truWorkDay: number | null;
    perTransPrice: number;
    baseNumber?: number;
  }) => {
    let transSubsidy = 0;
    const truWorkDays = truWorkDay ? truWorkDay * 2 : 0;
    if (baseNumber <= 100) {
      // 第一档标准:不到100 次数
      const baseOneCount = Math.ceil((100 - baseNumber) / perTransPrice);
      // 第二档标准：100-150 次数
      const baseTwoCount = Math.ceil(
        (150 - baseOneCount * perTransPrice - baseNumber) /
          (perTransPrice * 0.8),
      );
      // 第三档标准：150以上

      if (baseOneCount >= truWorkDays) {
        transSubsidy = truWorkDays * perTransPrice;
      } else if (baseOneCount + baseTwoCount >= truWorkDays) {
        transSubsidy =
          perTransPrice * baseOneCount +
          perTransPrice * (truWorkDays - baseOneCount) * 0.8;
      } else {
        const baseThreeCount = truWorkDays - (baseOneCount + baseTwoCount);
        transSubsidy =
          perTransPrice * baseOneCount +
          perTransPrice * baseTwoCount * 0.8 +
          perTransPrice * baseThreeCount * 0.5;
      }
    } else if (baseNumber <= 150) {
      const baseTwoCount = Math.ceil(
        (150 - baseNumber) / (perTransPrice * 0.8),
      );

      if (baseTwoCount >= truWorkDays) {
        transSubsidy = perTransPrice * baseTwoCount * 0.8;
      } else {
        const baseThreeCount = truWorkDays - baseTwoCount;
        transSubsidy =
          perTransPrice * baseTwoCount * 0.8 +
          perTransPrice * baseThreeCount * 0.5;
      }
    } else {
      transSubsidy = perTransPrice * truWorkDays * 0.5;
    }

    return transSubsidy;
  };

  // 取消弹窗
  const handleCancel = () => {
    setIsModalOpen(false);
    resetFields();
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
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="餐补标准"
            name={'mealSupplementStandard'}
            key="mealSupplementStandard"
          >
            <Input type="number" />
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
