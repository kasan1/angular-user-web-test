import { Observable } from 'rxjs';

export interface IAuthService {
  exchangeRefreshToken: () => Observable<boolean | ITokenResult>;
  token: () => string;
}

export interface ITokenResult {
  accessToken: string;
  refreshToken: string;
}
