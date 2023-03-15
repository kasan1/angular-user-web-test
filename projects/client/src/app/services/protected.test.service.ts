import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ITestRecord } from '../components/protected-page/protected-page.component';
import {
  IPagination,
  ISort,
  ITable,
  toQueryString,
} from 'projects/shared/models/table';

@Injectable({ providedIn: 'root' })
export class ProtectedTestService {
  private readonly url = `${environment.identityUrl}/protectedtest`;

  constructor(private http: HttpClient) {}

  test1 = () => this.http.get<string>(`${this.url}/test1`);
  test2 = () => this.http.get<string>(`${this.url}/test2`);
  test3 = () => this.http.get<string>(`${this.url}/test3`);

  testTable = (p: IPagination & ISort) =>
    this.http.get<ITable<ITestRecord>>(
      `${this.url}/testTable${toQueryString(p)}`
    );
}
