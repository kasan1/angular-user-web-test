import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AgreementType } from 'projects/shared/models/agreementType';

@Injectable({ providedIn: 'root' })
export class AgreementService {
  private url = `${environment.sharedUrl}/agreement`;

  constructor(private http: HttpClient) {}

  addAgreement = (agreement: IAgreement) =>
    this.http.post<string>(`${this.url}/addAgreement`, agreement);

  checkUniversalAgreement = () =>
    this.http.get<boolean>(`${this.url}/checkAgreement`);
}

interface IAgreement {
  agreementType: AgreementType;
  signedXml: string;
}
