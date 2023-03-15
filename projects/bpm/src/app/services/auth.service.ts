import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, finalize, catchError, tap } from 'rxjs/operators';
import * as jwtDecode from 'jwt-decode';
import { of, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { IBpmUser } from '../models/bpm-user';
import { ILoginPayload } from '../store/payloads/auth.payload';
import { IAuthService, ITokenResult } from 'projects/shared/models/auth';

@Injectable({ providedIn: 'root' })
export class BpmAuthService implements IAuthService {
  private readonly url = `${environment.identityUrl}/Account`;
  private readonly tokenKey = 'accessToken';
  private readonly refreshKey = 'refreshToken';
  private readonly exchanging$ = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  registerPhysical = (data: any) =>
    this.http.post<number>(`${this.url}/registerPhysical`, data);

  login = (payload: ILoginPayload) =>
    this.http.post<ITokenResult>(`${this.url}/login`, payload).pipe(
      map((r) => {
        this._setLocalStorage(r);
        return this.loadFromStorage();
      })
    );

  exchangeRefreshToken = () => {
    if (!this._refreshToken() || this.exchanging$.value) return of(false);

    this.exchanging$.next(true);
    return this.http
      .post<ITokenResult>(
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
        map((r) => {
          this._setLocalStorage(r);
          return r;
        })
      );
  };

  logout = () => {
    localStorage.setItem(this.tokenKey, '');
    localStorage.setItem(this.refreshKey, '');
  };

  loadFromStorage = (): IBpmUser => this._decode();

  token = () => localStorage.getItem(this.tokenKey);

  private _refreshToken = () => localStorage.getItem(this.refreshKey);

  private _decode = () => {
    const token = localStorage.getItem(this.tokenKey);
    const decoded = token ? jwtDecode<IDecodedToken>(token) : null;
    if (!decoded) return null;

    return {
      ...decoded,
      expires: new Date(decoded.exp),
      notBefore: new Date(decoded.nbf),
    };
  };

  private _setLocalStorage = (result: ITokenResult) => {
    if (!result) return;
    localStorage.setItem(this.tokenKey, result.accessToken);
    localStorage.setItem(this.refreshKey, result.refreshToken);
  };
}

interface IDecodedToken extends IBpmUser {
  sub: string;
  nbf: number;
  exp: number;
}
