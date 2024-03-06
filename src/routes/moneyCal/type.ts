export interface ITableRow {
  wagesTitle: string;
  name: string;
  idCard: string;
  bankNo: string;
  bank: string;
  phone: string;
  workDay: string;
  overtimeDay: string;
  lateOrLeaveEarlyDay: string;
  otherVocationDay: string;
  absenteeismDay: string;
  baseWages: string;
  jobPerformance: string;
  levelWages: string;
  baseWagesSum: number | string;
  jobPerformancePer: string;
  jobPerformanceSubsidy: string;
  jobPerformanceSum: string;
  transSubsidy: number | string;
  lunchSubsidy: number | string;
  overTimeWages: string;
  workAgeSubsidy: string;
  otherSubsidy: string;
  subsidySum: string;
  lateOrLeaveEarlyPrice: string;
  otherVocationPrice: string;
  absenteeismPrice: string;
  otherDeductWages: string;
  deductWagesSum: string;
  finallyWages: string;
}

export const initTableRow: ITableRow = {
  wagesTitle: '',
  name: '',
  idCard: '',
  bankNo: '',
  bank: '',
  phone: '',
  workDay: '',
  overtimeDay: '',
  lateOrLeaveEarlyDay: '',
  otherVocationDay: '',
  absenteeismDay: '',
  baseWages: '',
  jobPerformance: '',
  levelWages: '',
  baseWagesSum: '',
  jobPerformancePer: '',
  jobPerformanceSubsidy: '',
  jobPerformanceSum: '',
  transSubsidy: '',
  lunchSubsidy: '',
  overTimeWages: '',
  workAgeSubsidy: '',
  otherSubsidy: '',
  subsidySum: '',
  lateOrLeaveEarlyPrice: '',
  otherVocationPrice: '',
  absenteeismPrice: '',
  otherDeductWages: '',
  deductWagesSum: '',
  finallyWages: '',
};

export interface IFormData {
  project: string;
  name: string;
  allWorkDay: string;
  truWorkDay: string;
  baseWages: string;
  perTransPrice: string;
  jobPerformanceSubsidy: string;
  workAgeSubsidy: string;
  otherSubsidy: string;
}

export const initFormData: IFormData = {
  project: '',
  name: '',
  allWorkDay: '',
  truWorkDay: '',
  baseWages: '',
  perTransPrice: '',
  jobPerformanceSubsidy: '',
  workAgeSubsidy: '',
  otherSubsidy: '',
};
