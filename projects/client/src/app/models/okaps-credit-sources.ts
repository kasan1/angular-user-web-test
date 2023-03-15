export interface IOkapsCreditSource {
    id: number;
    createdDate: Date;
    modifiedDate: Date;
    name: string;
    percentStandart: number;
    percentEffStandart: number;
    percentSocial: number;
    percentEffSocial: number;
    maxMonth: number;
    maxSum: number;
    maxSumAnchor: number;
    dicProduct: IDicProduct;
    dicProductId: string;
}

export interface IDicProduct {
    code: string;
    nameRu: string;
    nameKz: string;
    id: string;
}