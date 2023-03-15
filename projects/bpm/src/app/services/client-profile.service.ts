import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IClientProfile } from 'projects/shared/models/clientProfile';

@Injectable({ providedIn: 'root' })
export class BpmClientProfileService {
  private url = `${environment.sharedUrl}/ClientProfile`;
  constructor(private http: HttpClient) {}

  addProfile = (profile: IClientProfile) =>
    this.http.post<string>(`${this.url}/AddClientProfile`, profile);

  updateProfile = (profile: IClientProfile) =>
    this.http.post(`${this.url}/UpdateClientProfile`, profile);

  updateProfileConclusion = (profile: IClientProfile) =>
    this.http.post(`${this.url}/UpdateClientProfileConclusion`, profile);

  clientProfile = (userId: string) =>
    this.http.get<IClientProfile>(`${this.url}/GetClientProfile/${userId}`);
}
