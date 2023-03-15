import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, finalize, catchError, tap } from 'rxjs/operators';
import * as jwtDecode from 'jwt-decode';
import { of, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { IOkapsUser, ITokenClaims } from '../models/user.model';
import { ILoginPayload } from '../store/payloads/auth.payload';
import { IAuthService, ITokenResult } from 'projects/shared/models/auth';
import { IResponse } from '../models/common.model';

@Injectable({ providedIn: 'root' })
export class OkapsAuthService implements IAuthService {
  private readonly url = `${environment.sharedUrl}/users`;
  private readonly tokenKey = 'accessToken';
  private readonly refreshKey = 'refreshToken';
  private readonly exchanging$ = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  registerUser = (data: any) =>
    this.http.post<number>(`${this.url}/register`, data);

  login = (payload: ILoginPayload) =>
    this.http.post<IResponse<ITokenResult>>(`${this.url}/login`, payload).pipe(
      map((response) => {
        this._setLocalStorage(response);
        return this.loadFromStorage();
      })
    );

  getProfile = () =>
    this.http.get<IResponse<IOkapsUser>>(`${this.url}/profile`).pipe(
      map((response) => {
        return response;
      })
    );

  exchangeRefreshToken = () => {
    if (!this._refreshToken() || this.exchanging$.value) return of(false);

    this.exchanging$.next(true);
    return this.http
      .post<IResponse<ITokenResult>>(
        `${this.url}/refresh`,
        {},
        {
          headers: new HttpHeaders({
            'X-Refresh-Token': this._refreshToken(),
            'X-Access-Token': this.token(),
          }),
        }
      )
      .pipe(
        finalize(() => this.exchanging$.next(false)),
        catchError(() =>
          of(null).pipe(tap(() => this.exchanging$.next(false)))
        ),
        map((response) => {
          this._setLocalStorage(response);

          return response.data;
        })
      );
  };

  logout = () => {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
  };

  loadFromStorage = (): ITokenClaims => this._decodeToken();

  token = () => localStorage.getItem(this.tokenKey);

  private _refreshToken = () => localStorage.getItem(this.refreshKey);

  private _decodeToken = () => {
    const token = localStorage.getItem(this.tokenKey);
    const decoded = token ? jwtDecode<ITokenClaims>(token) : null;
    if (!decoded) {
      return null;
    }

    return decoded;
  };

  private _setLocalStorage = (response: IResponse<ITokenResult>) => {
    if (!!response) {
      localStorage.setItem(this.tokenKey, response.data.accessToken);
      localStorage.setItem(this.refreshKey, response.data.refreshToken);
    }
  };
}
