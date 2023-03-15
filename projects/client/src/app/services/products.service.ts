import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IOkapsCreditSource } from '../models/okaps-credit-sources';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  ITable,
  IPagination,
  ISort,
  toQueryString,
} from 'projects/shared/models/table';
import { ILoanApplication } from '../models/application.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly creditSourcesUrl = `${environment.sharedUrl}/CreditSources`;
  private readonly processUrl = `${environment.sharedUrl}/LoanApplication`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<IOkapsCreditSource[]> {
    return this.http
      .get<IOkapsCreditSource[]>(`${this.creditSourcesUrl}/`)
      .pipe(map((sources) => sources.map((source) => source)));
  }

  getApplications = (data: any) => {
    return this.http.post<ITable<IApplicationEntry>>(
      `${this.processUrl}/GetClientApllications`,
      data
    );
  };
  GetApplications() {
    return this.http.get<any>(`${this.processUrl}/GetApplications`);
  }
  DeleteApplications(id: any) {
    return this.http.get<any>(`${this.processUrl}/DeleteApplication/${id}`);
  }
  applicationsTable = (p: IPagination & ISort) =>
    this.http.get<ITable<ILoanApplication>>(
      `${this.processUrl}/GetClientApllications${toQueryString(p)}`
    );

  startProcess = (data: any) => {
    return this.http.post<string>(`${this.processUrl}/StartApplication`, data);
  };
  CreateProcess = (data: any) => {
    const body = JSON.stringify(data);
    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post<boolean>(this.processUrl + '/CreateStatusTempApplication', body, {
        headers: headerOptions,
      })
      .pipe(catchError(this.handleError.bind(this)));
  };
  handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side Error :', errorResponse.error.message);
    } else {
      console.error('Server Side Error :', errorResponse);
    }

    // return an observable with a meaningful error message to the end user
    return throwError(
      'There is a problem with the service.We are notified & working on it.Please try again later.'
    );
  }
  test() {
    let model = '';
    console.log(`${this.processUrl}/Test`);
    return this.http.post<string>(`${this.processUrl}/Test`, model);
  }
}

export interface IApplicationEntry {
  id: string;
  userId: string;
  number: string; //Номер заявки
  dateCreated: Date; //Дата заявки
  clientFullName: string; //ФИО клиента
  purpose: string; //Цель
  iin: string; //IIN
  status: ApplicationType;
}

export enum ApplicationType {
  All = -1,
  New = 1,
  InWork = 2,
  Review = 3,
  Rework = 4,
  Archive = 5,
}
