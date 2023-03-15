import { LizingType } from './lizing.model';

export interface ILoanApplication {
  loanApplicationId: string;
  loanStatus: number;
  loanStatusName: string;
  registerNumber: string;
  createdDate: string;
  loanType: LizingType;
  loanTypeName: string;
  contracts: IContractDetails[];
}

export interface IContractDetails {
  id: string;
  loanApplicationId: string;
  calculator: ICalculatorBase;
  technic: ITechnicBase;
  accessories: IAccessory[];
  provisions: IProvision[];
}

export interface ICalculatorBase {
  period: number;
  rate: number;
  sum: number;
  coFinancing: number;
}

export interface ITechnicBase {
  id: string;
  countryId: string;
  techProductId: string;
  techProduct: string;
  providerId: string;
  provider: string;
  techModelId: string;
  techModel: string;
  price: number;
  count: number;
}

export interface ITechnic extends ITechnicBase {
  techTypeId: string;
  techSubtypeId: string;
}

export interface IAccessory extends ITechnicBase {}

export interface IProvision {
  id?: string;
  typeId: string;
  type: string;
  descriptionId: string;
  description: string;
  sum: number;
}

export interface IContractListItem {
  id: string;
  loanApplicationId: string;
  number: string;
  createdDate: Date;
  description: string;
  status: string;
  principalDebtBalance: number;
  calculator: ICalculatorBase;
  scheduleUrl: string;
}

// Table data
export interface ILoanApplicationTableData {
  loanApplicationId: string;
  registerNumber: string;
  createdDate: string;
  status: string;
  type: string;
  subject: string;
  sum: number;
  rate: number;
}
