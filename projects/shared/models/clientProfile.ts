export interface IClientProfile {
  fullName: string;
  iin: string;
  age: number;

  registrationAddressRu: string;
  registrationAddressKz: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  childrenCount: number;

  phone: string;
  additionPhone: string;

  documentTypeName: string;
  documentOrganizationName: string;
  documentNumber: string;
  documentBeginDate?: Date;
  documentEndDate?: Date;

  birthDate?: Date;
  birthPlaceRu?: string;

  companyNdc?: boolean;
  companyName?: string;
  companyAddress?: string;
  companyActivity?: string;
  companyRegisterDate?: Date;
  companyRegisterNumber?: string;
  companySerialNumber?: string;
  clientTypeId?: string;
  clientType?: string;
  filial?: string;

  userId: string;

  clientCategoryId?: string;
  bankId?: string;
  bankAccount?: string;
  applicationTaskId?: string;
}

export interface IBranchAddress {
  id: string;
  nameKz: string;
  nameRu: string;
  addressKz: string;
  addressRu: string;
}

export enum Gender {
  Male = 1,
  Female = 2,
}

export enum MaritalStatus {
  Single = 1,
  Married = 2,
  Divorced = 3,
  Widower = 4,
}

export const maritalStatusTitle = (x: MaritalStatus) => {
  switch (x) {
    case MaritalStatus.Divorced:
      return 'Разведен(а)';
    case MaritalStatus.Married:
      return 'Женат/Замужем';
    case MaritalStatus.Single:
      return 'Не женат/Не замужем';
    case MaritalStatus.Widower:
      return 'Вдовец/Вдова';
    default:
      return 'Не указано';
  }
};

export const maritalStatuses = () => {
  return [
    { name: 'Не женат / Не замужем', value: 1 },
    { name: 'Женат / Замужем', value: 2 },
    { name: 'Разведен(а)', value: 3 },
    { name: 'Вдовец / Вдова', value: 4 },
  ];
};
