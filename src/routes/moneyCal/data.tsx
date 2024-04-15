import { Button, Select } from 'antd';
import { ColumnsType } from 'antd/es/table/InternalTable';
import { ITableRow } from './type';

// export type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;

export const columns = ({
  daysList,
  monthlyAttendanceDays,
  edit,
  del,
  getColumnsData,
  handleMonthlyAttendanceDaysChange,
}: {
  daysList: { label: string; value: string }[];
  monthlyAttendanceDays: string;
  del: (record: ITableRow, index: number) => void;
  edit: (record: ITableRow, index: number) => void;
  getColumnsData: (arr: ColumnsType<any>) => void;
  handleMonthlyAttendanceDaysChange: (val: string) => void;
}): ColumnsType<ITableRow> => {
  const columnsArr: ColumnsType<ITableRow> = [
    {
      title: (
        <>
          <span>月应出勤天数</span>&nbsp;&nbsp;
          <Select
            style={{ width: '60px' }}
            value={monthlyAttendanceDays}
            options={daysList}
            onChange={handleMonthlyAttendanceDaysChange}
          />
        </>
      ),
      align: 'center',
      fixed: 'left',
      children: [
        {
          title: '基本信息',
          align: 'center',
          children: [
            {
              title: '所属项目',
              align: 'center',
              dataIndex: 'project',
              width: 80,
            },
            {
              title: '姓名',
              align: 'center',
              dataIndex: 'name',
              width: 80,
            },
            {
              title: '身份证号',
              align: 'center',
              dataIndex: 'idCard',
              width: 80,
            },
            {
              title: '银行卡号',
              align: 'center',
              dataIndex: 'bankNo',
              width: 80,
            },
            {
              title: '开户行',
              align: 'center',
              dataIndex: 'bank',
              width: 80,
            },
            {
              title: '电话',
              align: 'center',
              dataIndex: 'phone',
              width: 80,
            },
          ],
        },
      ],
    },
    {
      title: '应发金额',
      align: 'center',
      children: [
        {
          title: '出勤情况',
          children: [
            {
              title: '出勤天数',
              align: 'center',
              dataIndex: 'workDay',
              width: 80,
            },
            {
              title: '加班时间',
              align: 'center',
              dataIndex: 'overtimeDay',
              width: 80,
            },
            {
              title: '迟到早退',
              align: 'center',
              dataIndex: 'lateOrLeaveEarlyDay',
              width: 80,
            },
            {
              title: '病事假',
              align: 'center',
              dataIndex: 'otherVocationDay',
              width: 80,
            },
            {
              title: '旷工',
              align: 'center',
              dataIndex: 'absenteeismDay',
              width: 80,
            },
          ],
        },
        {
          title: '基本部分',
          align: 'center',
          children: [
            {
              title: '基本工资',
              align: 'center',
              dataIndex: 'baseWages',
              width: 80,
            },
            {
              title: '岗位绩效',
              align: 'center',
              dataIndex: 'jobPerformance',
              width: 80,
            },
            {
              title: '岗位等级工资',
              align: 'center',
              dataIndex: 'levelWages',
              width: 120,
            },
            {
              title: '基本部分合计',
              align: 'center',
              dataIndex: 'baseWagesSum',
              width: 120,
            },
          ],
        },
        {
          title: '绩效部分',
          align: 'center',
          children: [
            {
              title: '绩效工资（计件）',
              align: 'center',
              dataIndex: 'jobPerformancePer',
              width: 140,
            },
            {
              title: '绩效补贴',
              align: 'center',
              dataIndex: 'jobPerformanceSubsidy',
              width: 80,
            },
            {
              title: '绩效部分合计',
              align: 'center',
              dataIndex: 'jobPerformanceSum',
              width: 120,
            },
          ],
        },
        {
          title: '补助情况',
          align: 'center',
          children: [
            {
              title: '交通补助',
              align: 'center',
              dataIndex: 'transSubsidy',
              width: 80,
            },
            {
              title: '午餐补助',
              align: 'center',
              dataIndex: 'lunchSubsidy',
              width: 80,
            },
            {
              title: '加班薪资',
              align: 'center',
              dataIndex: 'overTimeWages',
              width: 80,
            },
            {
              title: '工龄补助',
              align: 'center',
              dataIndex: 'workAgeSubsidy',
              width: 80,
            },
            {
              title: '其他',
              align: 'center',
              dataIndex: 'otherSubsidy',
              width: 80,
            },
            {
              title: '合计',
              align: 'center',
              dataIndex: 'subsidySum',
              width: 80,
            },
          ],
        },
      ],
    },
    {
      title: '应扣工资',
      align: 'center',
      children: [
        {
          title: '出勤栏',
          align: 'center',
          children: [
            {
              title: '迟到早退',
              align: 'center',
              dataIndex: 'lateOrLeaveEarlyPrice',
              width: 80,
            },
            {
              title: '病事假',
              align: 'center',
              dataIndex: 'otherVocationPrice',
              width: 80,
            },
            {
              title: '旷工',
              align: 'center',
              dataIndex: 'absenteeismPrice',
              width: 80,
            },
            {
              title: '其他',
              align: 'center',
              dataIndex: 'otherDeductWages',
              width: 80,
            },
            {
              title: '合计',
              align: 'center',
              dataIndex: 'deductWagesSum',
              width: 80,
            },
          ],
        },
      ],
    },
    {
      title: '实发工资',
      align: 'center',
      dataIndex: 'finallyWages',
      width: 80,
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 200,
      render: (text, record, index) => {
        return (
          <>
            <Button type="primary" onClick={() => edit(record, index)}>
              编辑
            </Button>
            &nbsp;&nbsp;
            <Button type="primary" onClick={() => del(record, index)}>
              删除
            </Button>
          </>
        );
      },
    },
  ];

  getColumnsData(columnsArr);

  return [...columnsArr];
};
