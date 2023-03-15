import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApplicationStatusService {
  private url = `${environment.sharedUrl}`;

  constructor(private http: HttpClient) {}

  addApplicationStatus = (applicationStatus: IApplicationStatus) =>
    this.http.post<string>(`${this.url}/applicationStatus/addApplicationStatus`, applicationStatus);

  checkUniversalApplicationStatus = () =>
    this.http.get<boolean>(`${this.url}/applicationStatus/checkApplicationStatus`);

  downloanDocs = () => {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.get(`${this.url}/File/DownloadListOfDocuments`, { headers: headers, responseType: 'blob' });
  }

}

interface IApplicationStatus {
  signedXml: string;
}
