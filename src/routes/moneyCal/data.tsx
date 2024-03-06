import { ColumnsType } from 'antd/es/table/interface';
import { ITableRow } from './type';

export const columns: () => ColumnsType<ITableRow> = () => {
  return [
    {
      title: '月应出勤天数',
      children: [
        {
          title: '工资条',
          children: [
            {
              title: '',
              dataIndex: 'wagesTitle',
              width: 80,
            },
          ],
        },
        {
          title: '姓名',
          children: [
            {
              title: '',
              dataIndex: 'name',
              width: 80,
            },
          ],
        },
        {
          title: '身份证号',
          children: [
            {
              title: '',
              dataIndex: 'idCard',
              width: 80,
            },
          ],
        },
        {
          title: '银行卡号',
          children: [
            {
              title: '',
              dataIndex: 'bankNo',
              width: 80,
            },
          ],
        },
        {
          title: '开户行',
          children: [
            {
              title: '',
              dataIndex: 'bank',
              width: 80,
            },
          ],
        },
      ],
    },
    {
      title: new Date().getDate(),
      children: [
        {
          title: '电话',
          dataIndex: 'phone',
          key: 'phone',
          width: 80,
        },
      ],
    },
    {
      title: '应发金额',
      children: [
        {
          title: '出勤情况',
          children: [
            {
              title: '出勤天数',
              dataIndex: 'workDay',
              key: 'workDay',
              width: 100,
            },
            {
              title: '加班时间',
              dataIndex: 'overtimeDay',
              key: 'overtimeDay',
              width: 100,
            },
            {
              title: '迟到早退',
              dataIndex: 'lateOrLeaveEarlyDay',
              key: 'lateOrLeaveEarlyDay',
              width: 100,
            },
            {
              title: '病事假',
              dataIndex: 'otherVocationDay',
              key: 'otherVocationDay',
              width: 100,
            },
            {
              title: '旷工',
              dataIndex: 'absenteeismDay',
              key: 'absenteeismDay',
              width: 100,
            },
          ],
        },
        {
          title: '基本部分',
          children: [
            {
              title: '基本工资',
              dataIndex: 'baseWages',
              key: 'baseWages',
              width: 100,
            },
            {
              title: '岗位绩效',
              dataIndex: 'jobPerformance',
              key: 'jobPerformance',
              width: 100,
            },
            {
              title: '岗位等级工资',
              dataIndex: 'levelWages',
              key: 'levelWages',
              width: 100,
            },
            {
              title: '基本部分合计',
              dataIndex: 'baseWagesSum',
              key: 'baseWagesSum',
              width: 100,
            },
          ],
        },
        {
          title: '绩效部分',
          children: [
            {
              title: '绩效工资（计件）',
              dataIndex: 'jobPerformancePer',
              key: 'jobPerformancePer',
              width: 100,
            },
            {
              title: '绩效补贴',
              dataIndex: 'jobPerformanceSubsidy',
              key: 'jobPerformanceSubsidy',
              width: 100,
            },
            {
              title: '绩效部分合计',
              dataIndex: 'jobPerformanceSum',
              key: 'jobPerformanceSum',
              width: 100,
            },
          ],
        },
        {
          title: '补助情况',
          children: [
            {
              title: '交通补助',
              dataIndex: 'transSubsidy',
              key: 'transSubsidy',
              width: 100,
            },
            {
              title: '午餐补助',
              dataIndex: 'lunchSubsidy',
              key: 'lunchSubsidy',
              width: 100,
            },
            {
              title: '加班薪资',
              dataIndex: 'overTimeWages',
              key: 'overTimeWages',
              width: 100,
            },
            {
              title: '工龄补助',
              dataIndex: 'workAgeSubsidy',
              key: 'workAgeSubsidy',
              width: 100,
            },
            {
              title: '其他',
              dataIndex: 'otherSubsidy',
              key: 'otherSubsidy',
              width: 100,
            },
            {
              title: '合计',
              dataIndex: 'subsidySum',
              key: 'subsidySum',
              width: 100,
            },
          ],
        },
      ],
    },
    {
      title: '应扣工资',
      children: [
        {
          title: '出勤栏',
          children: [
            {
              title: '迟到早退',
              dataIndex: 'lateOrLeaveEarlyPrice',
              key: 'lateOrLeaveEarlyPrice',
              width: 100,
            },
            {
              title: '病事假',
              dataIndex: 'otherVocationPrice',
              key: 'otherVocationPrice',
              width: 100,
            },
            {
              title: '旷工',
              dataIndex: 'absenteeismPrice',
              key: 'absenteeismPrice',
              width: 100,
            },
            {
              title: '其他',
              dataIndex: 'otherDeductWages',
              key: 'otherDeductWages',
              width: 100,
            },
            {
              title: '合计',
              dataIndex: 'deductWagesSum',
              key: 'deductWagesSum',
              width: 100,
            },
          ],
        },
      ],
    },
    {
      title: '实发工资',
      dataIndex: 'finallyWages',
      key: 'finallyWages',
      width: 100,
      fixed: 'right',
    },
  ];
};
