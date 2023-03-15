import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AgreementType } from 'projects/shared/models/agreementType';
import { IResponse } from '../models/common.model';

@Injectable({ providedIn: 'root' })
export class AgreementService {
  private url = `${environment.sharedUrl}/agreement`;

  constructor(private http: HttpClient) {}

  addAgreement = (agreement: IAgreement) =>
    this.http.post<IResponse<string>>(`${this.url}`, agreement);
  checkUniversalAgreement = () =>
    this.http.get<boolean>(`${this.url}/checkAgreement`);
}

interface IAgreement {
  agreementType: AgreementType;
  signedXml: string;
}
