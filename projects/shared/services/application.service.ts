import { HttpClient } from '@angular/common/http';
import { IClientProfile } from '../models/clientProfile';
import { IPagination, ISort, ITable } from '../models/table';

export class ApplicationService {
  constructor(protected url: string, protected http: HttpClient) {}

  application = (id: string) =>
    this.http.get<IApplication>(`${this.url}/LoanApplication/${id}`);

  setStatus = (applicationId: string, status: ApplicationType) =>
    this.http.post<boolean>(`${this.url}/LoanApplication/SetStatus`, {
      applicationId,
      status,
    });

  claimUser = (applicationTaskId: string) =>
    this.http.post<boolean>(
      `${this.url}/LoanApplication/ClaimUser?applicationTaskId=${applicationTaskId}`,
      {}
    );
  sendManager = (applicationTaskId: string) =>
    this.http.post<boolean>(
      `${this.url}/LoanApplication/ManagerSend?applicationTaskId=${applicationTaskId}`,
      {}
    );

  sendManagerConclusion = (profile: IClientProfile) =>
    this.http.post(
      `${this.url}/LoanApplication/ManagerConclusionSend`,
      profile
    );

  managerBossSend = (model: ICredAdmin) =>
    this.http.post(`${this.url}/LoanApplication/ManagerBossSend`, model);

  loadApplications = (
    filter: IPagination & ISort & { type: ApplicationType; search?: string }
  ) => {
    return this.http.post<ITable<IApplicationEntry>>(
      `${this.url}/LoanApplication/GetApplications`,
      {
        ...filter,
        column: filter.column || 'Id',
        direction: filter.direction || 'asc',
      }
    );
  };
  history = (appId: string) =>
    this.http.get<IApplicationEntry[]>(
      `${this.url}/LoanApplication/GetLoanHistory/${appId}`
    );

  loadStatistics = () =>
    this.http.get<any>(`${this.url}/LoanApplication/statistics`);

  updateProductCode = (request: {
    applicationId: string;
    loanProductCode: string;
  }) =>
    this.http.post<boolean>(
      `${this.url}/LoanApplication/UpdateProductCode`,
      request
    );

  updateApplicationPurposeFields = (request: {
    applicationId: string;
    projectDescription: string;
    purposeDescription: string;
    annualPayment: number;
    capital: boolean;
    withoutFood: boolean;
    activityTypeId?: string;
    loanPurposeId?: string;
  }) =>
    this.http.post<boolean>(
      `${this.url}/LoanApplication/UpdateApplicationOtherFields`,
      request
    );

  loanCondition = (appId: string) =>
    this.http.get<IApplicationCondition>(
      `${this.url}/LoanApplication/LoanCondition/${appId}`
    );

  updateCondition = (request: IApplicationCondition) =>
    this.http.post<boolean>(
      `${this.url}/LoanApplication/LoanCondition`,
      request
    );
}

export interface IApplication {
  annualPayment: number;
  application: {
    id: string;
    userId: string;
    loanProductId: string;
    number: string;
    type: ApplicationType;
    purpose: string;
    dateCreated: Date;

    capital: boolean;
    withFood: boolean;
    activityTypeId?: string;
    loanPurposeId?: string;
    projectDescription: string;
    purposeDescription: string;

    cliLegalCommentVnd: string;
    cliLegalResultVnd: boolean;
    cliLegalCommentRk: string;
    cliLegalResultRk: boolean;
    pledgeComment: string;
    juristComment: string;
    bankId: string;
    bankAccount: string;
  };
  clientProfile: IClientProfile;
}

export interface IApplicationEntry {
  id: string;
  userId: string;
  number: string; //Номер заявки
  dateCreated: Date; //Дата заявки
  clientFullName: string; //ФИО клиента
  purpose: string; //Цель
  iin: string; //IIN
  status: ApplicationType;
  applicationTaskId: string;
  statusTitle: string;
  statusCode: string;
  comment: string;
  decisionCode: string;
  decisionNameRu: string;
  appointmentDate?: Date;
  factEndDate?: Date;
}

export enum ApplicationType {
  CMAll = -1,
  CMNew = 1,
  CMInWork = 2,
  CMReview = 3,
  CMRework = 4,
  PrepareCreditDossier = 50,
  Completed = 100,
  CMArchive = 5,
  CMFinished = 200,

  URBoss = 21,
  EPledge = 31,
  EPledgeBoss = 32,
  EAct = 41,

  URAll = -2,
  URNew = 6,
  URRework = 7,

  CCNew = 8,

  CredAdminAll = 60,
  CredAdminCheck = 61,
}

export interface IApplicationCondition {
  id: string;
  amount?: number;
  duration?: number;
  transh?: number;
  method?: number;
  periodOd?: number;
  periodPercent?: number;
  paymentOd?: number;
  paymentPercent?: number;
  paymentDay?: number;
  loanApplicationId: string;
  planId?: string;
}

export interface ICredAdmin {
  appTaskId: string;
  decision: string;
  comment?: string;
}
