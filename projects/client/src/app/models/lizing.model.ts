import { Dictionary } from 'lodash';
import { IDictionaryBase } from './common.model';

// Store
export interface ILizingState {
  applicationId?: string;
  contracts: string[];
  contractsData: Dictionary<ILizingContract>;
  submitted: boolean;
  persistant: boolean;
}

export interface ILizingContract {
  permanent: boolean;
  productForm: IProductFormState | null;
  productDictionaries: IProductDictinaries;
  accessories: IAccessoryFromState[];
  calculatorResult: ICalculatorResult | null;
  calculatorForm: ILizingCalculatorFormValues;
  hasProvisions: boolean;
  provisions: IProvisioning[];
}

export interface LizingFormDialogIProps {
  id: string;
  maxPrice: number;
  accessoryIndex: number | null;
  formInitialValues: IProductFormState;
}

export interface IProductDictinaries {
  techTypesCollection: IDictionaryBase[];
  techSubtypesCollection: IDictionaryBase[];
  techProductsCollection: IDictionaryBase[];
  modelsCollection: IDictionaryBase[];
  manufacturersCollection: IDictionaryBase[];
  suppliersCollection: IDictionaryBase[];
}

export interface IProductFormState {
  id?: string;
  techType: IDictionaryBase;
  techSubtype: IDictionaryBase;
  techProduct: IDictionaryBase;
  model: IDictionaryBase;
  manufacturer: IDictionaryBase;
  supplier: IDictionaryBase;
  price: number;
  count: number;
}

export interface IAccessoryFromState {
  accessoryForm: IProductFormState | null;
  accessoryDictionaries: IProductDictinaries;
}

// Lizing Form
export interface ICreateLizingApplicationFormValues {
  contracts: ILizingContractFormValues[];
  applicationId?: string;
}

export interface ILizingContractFormValues {
  id?: string;
  technic: ILizingTechnicFormValues;
  accessories: ILizingAccessoryFormValues[];
  calculator: ILizingCalculatorFormValues;
  hasProvisions: boolean;
  provisions: IProvisioning[];
}

export interface ILizingTechnicFormValues {
  techTypeId: string;
  techSubtypeId: string;
  techProductId: string;
  techModelId: string;
  countryId: string;
  providerId: string;
  price: number;
  count: number;
}

export interface ILizingAccessoryFormValues {
  id?: string;
  techProductId: string;
  techModelId: string;
  countryId: string;
  providerId: string;
  price: number;
  count: number;
}

export interface ILizingCalculatorFormValues {
  period: number;
  coFinancing: number;
}

// Lizing response
export interface ILizingContractResponse {
  id?: string;
  technic: ILizingTechnic;
  accessories: ILizingAccessory[];
  calculator: ILizingCalculatorFormValues;
  calculatorResult: ICalculatorResult;
  hasProvisions: boolean;
  provisions: IProvisioning[];
}

export interface ILizingTechnic extends ILizingTechnicFormValues {
  techTypes: IDictionaryBase[];
  techSubtypes: IDictionaryBase[];
  techProducts: IDictionaryBase[];
  techModels: IDictionaryBase[];
  countries: IDictionaryBase[];
  providers: IDictionaryBase[];
}

export interface ILizingAccessory extends ILizingAccessoryFormValues {
  techProducts: IDictionaryBase[];
  techModels: IDictionaryBase[];
  countries: IDictionaryBase[];
  providers: IDictionaryBase[];
}

// Table data
export interface ILizingTableValues {
  techProductName: string;
  modelName: string;
  manufacturerName: string;
  supplierName: string;
  price: number;
  count: number;
  isAccessory: boolean;
}

// Calculator form
export interface ICalculatorInput {
  techTypeId: string;
  techSubTypeId: string;
  countryId: string;
  price: number;
  count: number;
  accessories: ICalculatorInputAccessory[];
}

export interface ICalculatorInputAccessory {
  price: number;
  count: number;
}

export interface ICalculatorResult {
  rate: number;
  period: number;
  coFinancing: number;
  sum: number;
  loanType: LizingType;
}

export enum LoanTypeEnum {
  Lizing = 'Lizing',
  Credit = 'Credit',
}

export enum TechConditionEnum {
  New = 'New',
  Used = 'Used',
}

export enum LizingType {
  Default = 0,
  Standard = 1,
  Express = 2,
}

// Provisioning
export interface IProvisioning {
  id?: string;
  typeId: string;
  type: string;
  descriptionId: string;
  description: string;
  sum: number;
}
