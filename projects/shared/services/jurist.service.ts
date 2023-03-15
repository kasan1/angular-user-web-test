import { HttpClient } from '@angular/common/http';
import { IDictionaryItem } from 'projects/shared/services/dictionary.service';
import { IFileInfo } from '../models/fileInfo';
import { ILegalComment } from './pledge.service';

export class JuristService {
  constructor(protected url: string, protected http: HttpClient) {}

  updateJuristComment = (urist: IJuristComment) =>
    this.http.post(`${this.url}/Jurist/UpdateJuristComment`, urist);

  updateJuristResult = (jurResult: IJuristResult) =>
    this.http.post(`${this.url}/Jurist/UpdateJuristResult`, jurResult);
  updateJuristResultConfirm = (result: IJuristResult) =>
    this.http.post(`${this.url}/Jurist/UpdateJuristResultConfirm`, result);

  сlassificationSubtitles = (id: string) =>
    this.http.get<IDictionaryItem[]>(
      `${this.url}/Jurist/GetDicClassificationSubtitles/${id}`
    );
  warningClassification = (id: string) =>
    this.http.get<IDictionaryItem[]>(
      `${this.url}/Jurist/GetWarningClassification/${id}`
    );

  addJuristResult = (urist: IJuristResult) =>
    this.http.post<string>(`${this.url}/Jurist/AddJuristResult`, urist);

  deleteJuristResult = (id: string) =>
    this.http.get<string>(`${this.url}/Jurist/DeleteJuristResult/${id}`);

  getJuristResults = (id: string) =>
    this.http.get<IJuristResult[]>(`${this.url}/Jurist/GetJuristResults/${id}`);

  getJuristComment = (applicationId: string) =>
    this.http.get<IJuristComment>(
      `${this.url}/Jurist/GetJuristComment/${applicationId}`
    );

  setPledgeExpert = (urist: IJuristResult) =>
    this.http.post<string>(`${this.url}/Jurist/SetPledgeExpert`, urist);

  submitActVisit = (appId: string, appTaskid: string) =>
    this.http.get<string>(
      `${this.url}/Jurist/SubmitActVisit/${appId}/${appTaskid}`
    );

  setJurist = (urist: IJuristResult) =>
    this.http.post<string>(`${this.url}/Jurist/SetJurist`, urist);
}

export interface IJuristComment {
  applicationId: string;
  text: string;
  //description: string;
  //Code: string;
  clientCommentVnd: string;
  clientResultVnd: boolean;
  clientCommentRk: string;
  clientResultRk: boolean;
  applicationTaskId: string;

  chargees: ILegalComment[];
  pledges: ILegalComment[];
}

export interface IJuristResult {
  id?: string;
  code?: string;
  juristResultId?: string;
  applicationId?: string;
  warningClassificationId?: string;
  warningClassification?: IDictionaryItem;
  applicationTaskId?: string;
  docClassificationText?: string;
  subtitleClassificationText?: string;
  warningClassificationText?: string;

  isFixed?: boolean;
  fixReason?: string;
  isConfirm?: boolean;
  fixFileId?: string;
  fixFile?: IFileInfo;
}
