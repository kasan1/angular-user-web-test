import { HttpClient } from '@angular/common/http';
import { IClientProfile } from '../models/clientProfile';

export class BpmService {
  constructor(protected url: string, protected http: HttpClient) { }

  getJuristUsers = () =>
    this.http.get<IClientProfile[]>(`${this.url}/BPM/GetJuristUsers`);

  getEPledgeUsers = () =>
    this.http.get<IClientProfile[]>(`${this.url}/BPM/GetPledgeSpecialists`);
}
