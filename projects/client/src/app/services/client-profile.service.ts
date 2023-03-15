import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {
  IClientProfile,
  IBranchAddress,
} from 'projects/shared/models/clientProfile';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OkapsClientProfileService {
  private url = `${environment.sharedUrl}/ClientProfile`;
  private readonly processUrl = `${environment.sharedUrl}/LoanApplication`;

  constructor(private http: HttpClient) {}

  clientProfile = () =>
    this.http.get<IClientProfile>(`${this.url}/GetCurrentUserProfile/`);

  branchAdress = () =>
    this.http.get<IBranchAddress>(`${this.url}/GetBranchAdressCurrentUser/`);

  SaveClientSelectedTechs = (data: any) => {
    console.log(JSON.stringify(data));
    const body = JSON.stringify(data);
    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post<string>(this.processUrl + '/TechInApplication', body, {
        headers: headerOptions,
      })
      .pipe(catchError(this.handleError.bind(this)));
  };

  GetAppTechsByAppLoanId(data: any) {
    return this.http.get<any>(
      `${this.processUrl}/GetAppTechsByAppLoanId/${data}`
    );
  }
  GetStepbyApp(data: any) {
    return this.http.get<any>(`${this.processUrl}/GetStep/${data}`);
  }

  GetFloraActivitiesByReg(data: any) {
    return this.http.get<any>(
      `${this.processUrl}/GetFloraCultureByRegionId/${data}`
    );
  }
  GetCLientActives(data: any) {
    return this.http.get<any>(`${this.processUrl}/GetCLientActives/${data}`);
  }
  GetCLientAnketa(data: any) {
    return this.http.get(`${this.processUrl}/GetAnketaByLoanAppId/${data}`, {
      responseType: 'blob',
    });
  }
  GetCLientZayav(data: any) {
    return this.http.get(`${this.processUrl}/GetStatementByLoanAppId/${data}`, {
      responseType: 'blob',
    });
  }
  GetCLientDetails(data: any) {
    return this.http.get<any>(`${this.processUrl}/GetClientDetails/${data}`);
  }

  CompleteLoanApp(data: any) {
    return this.http.get<any>(`${this.processUrl}/CompleteLoanApp/${data}`);
  }
  SaveClientDetails = (data: any) => {
    console.log(JSON.stringify(data));
    const body = JSON.stringify(data);
    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post<string>(this.processUrl + '/ClientDetailsInApplication', body, {
        headers: headerOptions,
      })
      .pipe(catchError(this.handleError.bind(this)));
  };
  SaveClientActivity = (data: any) => {
    const body = JSON.stringify(data);
    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post<string>(this.processUrl + '/ActivityInApplication', body, {
        headers: headerOptions,
      })
      .pipe(catchError(this.handleError.bind(this)));
  };

  UpdateClientDetails = (data: any) => {
    console.log(JSON.stringify(data));
    const body = JSON.stringify(data);
    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post<string>(
        this.processUrl + '/UpdateClientDetailsInApplication',
        body,
        {
          headers: headerOptions,
        }
      )
      .pipe(catchError(this.handleError.bind(this)));
  };
  UpdateClientActivity = (data: any) => {
    console.log(JSON.stringify(data));
    const body = JSON.stringify(data);
    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post<string>(this.processUrl + '/UpdateActivityInApplication', body, {
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
}
