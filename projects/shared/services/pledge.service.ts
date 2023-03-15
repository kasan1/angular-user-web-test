import { IPagination, ITable } from 'projects/shared/models/table';
import { HttpClient } from '@angular/common/http';
import { ISort } from '../models/table';
import { IHoldingEntry } from '../store/holding/holdingInitial';
import { IJuristComment } from './jurist.service';
import { IDictionaryItem } from './dictionary.service';

export class PledgeService {
  constructor(protected url: string, protected http: HttpClient) {}

  addPledge = (pledge: IBasePledge) =>
    this.http.post<string>(`${this.url}/Pledge/AddBasePledge`, pledge);

  loadPledges = (filter: ISort & IPagination & { applicationId: string }) =>
    this.http.post<ITable<IHoldingEntry>>(
      `${this.url}/Pledge/GetBasePledges`,
      filter
    );

  liquiditySummary = (appId: string) =>
    this.http.get<ILiquiditySummary>(
      `${this.url}/Pledge/LiquditySummary/${appId}`
    );

  updatePledge = (pledge: IBasePledge) =>
    this.http.post<string>(`${this.url}/Pledge/UpdateBasePledge`, pledge);

  pledge = (id: string) =>
    this.http.get<IBasePledge>(`${this.url}/Pledge/GetBasePledgeById/${id}`);

  chargeesByAppId = (id: string) =>
    this.http.get<IChargee[]>(`${this.url}/Pledge/GetChargeesByAppId/${id}`);

  updatePledgerResult = (urist: IJuristComment) =>
    this.http.post(`${this.url}/Pledge/UpdatePledgeExpertResult`, urist);

  getExpertiseResults = (appId: string) =>
    this.http.get<IExpertiseResult[]>(
      `${this.url}/ExpetiseResult/GetExpertiseResults/${appId}`
    );
  getLoanFinalSum = (appId: string) =>
    this.http.get<number>(`${this.url}/Pledge/GetLoanFinalSum/${appId}`);

  nokList = (appId: string) =>
    this.http.get<IDictionaryItem[]>(`${this.url}/Pledge/GetNoksList/${appId}`);
}

export interface IBasePledge extends INonMovable {
  id: string;
  asonSum?: number;
  nokSum?: number;
  expertSum?: number;
  nokName?: string;
  applicationId: string;
  agreement?: boolean;
  legalComment: string;

  firstLevel: PledgeFirstLevel;
  secondLevel?: PledgeSecondLevel;
  thirdLevel?: PledgeThirdLevel;

  chargees: IChargee[];
  liters: ILiter[];
}

export interface IChargee {
  id: string;
  iin: string;
  fullName: string;

  documentNumber: string;
  documentBeginDate?: Date;
  documentEndDate?: Date;
  documentOrganizationName: string;

  basePledgeId: string;
  samePerson: boolean;

  legalComment: string;
  legalCommentVnd: string;
  legalCommentRk: string;
  legalResultVnd: boolean;
  legalResultRk: boolean;
}

export interface ILiter {
  id: string;
  name: string;
  value: string;
  area?: number;
}

export interface INonMovable {
  cadastralNumber?: string;
  totalArea?: number;
  livingArea?: number;
  landArea?: number;
  builtYear?: number;
  address?: string;
  cato?: string;
  rent?: number;
  rentedFor?: number;
  landPurpose?: number;
  commercialType?: number;
}

export enum PledgeFirstLevel {
  Nonmovable = 1,
  Movable = 2,
  Guarantee = 3,
}

export enum PledgeSecondLevel {
  Living = 1,
  Commercial = 2,
  Land = 3,
  Transport = 1,
  Money = 2,
}

export enum PledgeThirdLevel {
  House = 1,
  Flat = 2,
  AutoTransport = 1,
  LandTransport = 2,
}

export interface ILegalComment {
  Id: string;
  ClientCommentVnd: string;
  ClientResultVnd: boolean;
  ClientCommentRk: string;
  ClientResultRk: boolean;
  expertSum?: number;
}

export interface ILiquiditySummary {
  totalSum: number;
  highLiquidity: number;
  lowLiquidity: number;
}

export interface IExpertiseResult {
  expertName?: string;
  code?: string;
  nameRu?: string;
  expertiseName?: string;
  expertiseNameRu?: string;
  comment?: string;
}
