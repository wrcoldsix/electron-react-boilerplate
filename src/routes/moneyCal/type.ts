export interface ITableRow {
  wagesTitle: string;
  name: string;
  idCard: string;
  bankNo: string;
  bank: string;
  phone: string;
  workDay: number | null;
  overtimeDay: number | null;
  lateOrLeaveEarlyDay: number | null;
  otherVocationDay: number | null;
  absenteeismDay: number | null;
  baseWages: number | null;
  jobPerformance: number | null;
  levelWages: number | null;
  baseWagesSum: number | null;
  jobPerformancePer: number | null;
  jobPerformanceSubsidy: number | null;
  jobPerformanceSum: number | null;
  transSubsidy: number | null;
  lunchSubsidy: number | null;
  overTimeWages: number | null;
  workAgeSubsidy: number | null;
  otherSubsidy: number | null;
  subsidySum: number | null;
  lateOrLeaveEarlyPrice: number | null;
  otherVocationPrice: number | null;
  absenteeismPrice: number | null;
  otherDeductWages: number | null;
  deductWagesSum: number | null;
  finallyWages: number | null;
  project: string;
  id?: null | number;
  allWorkDay?: number | null;
  perTransPrice?: number | null;
  mealSupplementStandard?: number | null;
}

export const initTableRow: ITableRow = {
  wagesTitle: '',
  name: '',
  idCard: '',
  bankNo: '',
  bank: '',
  phone: '',
  workDay: null,
  overtimeDay: null,
  lateOrLeaveEarlyDay: null,
  otherVocationDay: null,
  absenteeismDay: null,
  baseWages: null,
  jobPerformance: null,
  levelWages: null,
  baseWagesSum: null,
  jobPerformancePer: null,
  jobPerformanceSubsidy: null,
  jobPerformanceSum: null,
  transSubsidy: null,
  lunchSubsidy: null,
  overTimeWages: null,
  workAgeSubsidy: null,
  otherSubsidy: null,
  subsidySum: null,
  lateOrLeaveEarlyPrice: null,
  otherVocationPrice: null,
  absenteeismPrice: null,
  otherDeductWages: null,
  deductWagesSum: null,
  finallyWages: null,
  project: '',
  id: null,
  allWorkDay: null,
  perTransPrice: null,
  mealSupplementStandard: null,
};

export interface IFormData {
  project: string;
  name: string;
  allWorkDay: number | null;
  workDay: number | null;
  baseWages: number | null;
  perTransPrice: number | null;
  jobPerformanceSubsidy: number | null;
  workAgeSubsidy: number | null;
  otherSubsidy: number | null;
  mealSupplementStandard: number | null;
  overTimeWages: number | null;
}

export const initFormData: IFormData = {
  project: '',
  name: '',
  allWorkDay: null,
  workDay: null,
  baseWages: null,
  perTransPrice: null,
  jobPerformanceSubsidy: null,
  workAgeSubsidy: null,
  otherSubsidy: null,
  mealSupplementStandard: null,
  overTimeWages: null,
};
