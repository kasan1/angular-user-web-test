import { IApplicationCondition } from 'projects/shared/services/application.service';
import { HttpClient } from '@angular/common/http';
import { IClientProfile } from '../models/clientProfile';

export class ApplicationDocumentService {
  constructor(protected url: string, protected http: HttpClient) {}

  applicationFullInformation = (id: string) =>
    this.http.get<IApplicationFullInformation>(
      `${this.url}/ApplicationDocuments/${id}`
    );
}

export interface IApplicationFullInformation {
  application: {
    id: string;
    userId: string;
    regNumber: string;
    createDate: Date;
    product: string;
    purpose: string;
    activity: string;
  };
  condition: IApplicationCondition;
  client: IClientProfile;
  percent: number;
  businessPlanFileId: string;
}
