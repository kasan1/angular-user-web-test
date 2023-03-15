export interface ILandActivity {
  id?: string;
  landTypeId: string;
  landType: string;
  ownershipTypeId: string;
  ownershipType: string;
  square: number;
}

export interface IFloraActivity {
  id?: string;
  cultureId: string;
  culture: string;
  plannedSquare: number;
  priceRealization: number;
  seedingRate: number;
  cost: number;
  productivityCurrentYear: number;
  productivityLastYear: number;
  productivityBeforeLastYear: number;
}

export interface IProductivity {
  id?: string;
  year: string;
  value?: number;
}

export interface ILivestockActivity {
  id?: string;
  livestockTypeId: string;
  livestockType: string;
  count: number;
  liveWeight: number;
  slaughterWeight: number;
  livePrice: number;
  slaughterPrice: number;
}

export interface ITechnicActivity {
  id?: string;
  fullname: string;
  dateIssue: Date;
  count: number;
  countOfCorrect: number;
  isPledged: boolean;
  pledgeDescription: number;
}

export interface IAssets {
  id?: string;
  landActivities: ILandActivity[];
  floraActivities: IFloraActivity[];
  livestockActivities: ILivestockActivity[];
  technicActivities: ITechnicActivity[];
}
