export interface IGetTechTypesParams {
  parentId?: string;
  loanProductId?: string;
}

export interface IGetTechProductsParams {
  techTypeId?: string;
  accessoryId?: string;
}

export interface IGetTechModelsParams {
  techProductId: string;
  rate?: number;
}

export interface IGetManufacturersParams {
  techModelId: string;
  rate?: number;
}

export interface IGetSuppliersParams {
  countryId: string;
  techModelId: number;
}
