import { HttpClient } from '@angular/common/http';

export class FinAnalysisService {
  constructor(protected url: string, protected http: HttpClient) {}

  finAnalysisResult = (appId: string) =>
    this.http.get<IFinAnalysis>(
      `${this.url}/FinAnalysis/GetFinAnalysResultByAppId/${appId}`
    );

  finAnalysisResultForClient = (appId: string) =>
    this.http.get<IFinAnalysisClient>(
      `${this.url}/FinAnalysResult/GetFinAnalysResultForClient/${appId}`
    );
  public startFinAnalysisForClient(appId: string) {
    this.http.get(`${this.url}/FinAnalysResult/GetInfo/${appId}`);
  }
}

export interface IFinAnalysisClient {
  status: RejectStatuses;
  statusTitle: string;
  creditHistory: RejectStatuses;
  creditHistoryTitle: string;

  rejectDetails: string[];
  creditHistoryDetail: string[];
  finalErrorMessage: string;
}

export interface IFinAnalysis {
  annualPay: number;
  isAsa: boolean;

  status: RejectStatuses;
  creditHistory: RejectStatuses;
  creditHistoryDetail: string;
  isManyChildren: boolean;
  falseBusiness: RejectStatuses;
  falseBusinessDetail: string;
  bankrupt: RejectStatuses;
  bankruptDetail: string;
  wantedIncome: RejectStatuses;
  wantedIncomeDetail: string;
  inactive: RejectStatuses;
  inactiveDetail: string;
  taxesBankrupt: RejectStatuses;
  taxesBankruptDetail: string;
  taxArrear: RejectStatuses;
  taxArrearDetail: string;
  terrorList: RejectStatuses;
  terrorListDetail: string;
  aliment: RejectStatuses;
  alimentDetail: string;
  pedophily: RejectStatuses;
  pedophilyDetail: string;
  lostPeople: RejectStatuses;
  lostPeopleDetail: string;
  isAffiliation: RejectStatuses;
  affiliationDetail: string;

  creditReportId?: string;
}

export enum RejectStatuses {
  ServiceUnavailable = 0,
  Correct = 1,
  Minor = 2,
  Critical = 3,
}
