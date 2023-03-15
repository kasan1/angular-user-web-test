import { HttpClient } from '@angular/common/http';

export class CreditAdminService {
  constructor(protected url: string, protected http: HttpClient) {}

  credAdminSet = (request: ICreditAdminResult) =>
    this.http.post<number>(`${this.url}/CreditAdmin/AddResult`, request);
}

export interface ICreditAdminResult {
  applicationId: string;
  applicationTaskId: string;

  ClientDataAccept: boolean;
  ClientDataRemark: string;
  ClientDataManagerComment: string;

  ChargeeAccept: boolean;
  ChargeeRemark: string;
  ChargeeManagerComment: string;

  PledgesAccept: boolean;
  PledgesRemark: string;
  PledgesManagerComment: string;

  DocumentsAccept: boolean;
  DocumentsRemark: string;
  DocumentsManagerComment: string;
}


export interface ICreditCommitteeDecision {
  applicationId: string;
  userId: string;
  fullName: string;
  accept: boolean;
}
