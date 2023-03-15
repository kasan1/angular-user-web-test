import { LizingType } from './lizing.model';

export interface IClientState {
  details: IClientDetails | null;
}

export interface IPersonality {
  id?: string;
  identifier: string;
  fullName: string;
  fax: string;
  email: string;
  phone: IPhone;
  address: IAddress;
  identificationDocument: IDocument;
  workExperience?: IWorkExperience;
  region?: string;
}

export interface IWorkExperience {
  id?: string;
  total: string;
  agriculture: string;
}

export interface IPhone {
  id?: string;
  home: string;
  mobile: string;
  work: string;
}

export interface IAddress {
  id?: string;
  fact: string;
  register: string;
}

export interface IDocument {
  id?: string;
  number: string;
  issuer: string;
  dateIssue: Date;
}

export interface IBankAccount {
  id?: string;
  bic: string;
  number: string;
}

export interface ICreditHistory {
  id?: string;
  fullName: string;
  dateIssue: Date;
  period: number;
  sum: number;
  balance: number;
}

export interface IDebt {
  id?: string;
  bic: string;
  debt: number;
}

export interface IPerson extends IPersonality {
  id?: string;
  birthDate: Date;
  birthPlace: string;
  countryId: string;
  marriageStatusId: string;
  education: string;
  spouse?: string;
}

export interface IOrganization extends IPersonality {
  id?: string;
  regionId: string;
  legalFormId: string;
  ownershipFormId: string;
  oked: string[];
  registrationDocument: IDocument;
  parent: string;
  bankAccounts: IBankAccount[];
  shareInCapital: number;
  debts: IDebt[];
  isAffiliated: boolean;
  affiliatedOrganizations: IAffiliatedOrganization[];
  creditHistory: ICreditHistory[];
  taxTreatmentId: string;
  subjectOfEntrepreneurId: string;
  registeredDate?: Date;
}

export interface IAffiliatedOrganization extends IOrganization {
  head: IPerson;
}

export interface IClientDetails {
  id?: string;
  isReadOnly: boolean;
  loanType: LizingType;
  organization: IOrganization;
  head: IPerson;
  booker: IPerson;
  beneficiary?: IPerson;
  representative?: IPerson;
  contacts: IPerson[];
}

// Local forms
export interface IOrganizationBasicForm {
  fullName: string;
  address: IAddress;
  phone: IPhone;
  fax: string;
  email: string;
  organizationTypeId: string;
  ownershipFormId: string;
  oked: string[];
  identification: string;
  registrationDocument: IDocument;
  parent: string;
  identificationDocument: IDocument;
}

// Table data source
export interface IAffillatedOrganizationTableData {
  id?: string;
  fullname: string;
  identifier: string;
  banks: string;
  shareInCapital: number;
  debts: string;
  head: string;
}

// Store model
export interface IUpdateOrganizationDetails {
  organization: IOrganization;
  beneficiary?: IPerson;
  representative?: IPerson;
  contacts: IPerson[];
}

// Extra details
export interface IULOwner {
  id: string;
  fullName: string;
  rate: number;
  bankAccounts: IBankAccount[];
}

export interface IFLOwner {
  id: string;
  personId: string;
  fullName: string;
  identificationDocument: IDocument;
  address: IAddress;
}

export interface IOrganizationLicense {
  id: string;
  document: IDocument;
  essence: string;
}

export interface IClientExtraDetails {
  id: string;
  isReadOnly: boolean;
  ulOwners: IULOwner[];
  flOwners: IFLOwner[];
  licenses: IOrganizationLicense[];
  vatCertificate: IDocument;
}
