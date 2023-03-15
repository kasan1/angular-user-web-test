import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { IAuthService } from './auth';
import { Observable } from 'rxjs';
import { Injector } from '@angular/core';

export class JwtInterceptor implements HttpInterceptor {
  constructor(
    protected auth: IAuthService,
    private selectClaimsOnce: (store: Store) => Observable<any>,
    protected injector: Injector
  ) {
    this.store = injector.get(Store);
  }

  protected store: Store;

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return this.selectClaimsOnce(this.store).pipe(
      switchMap((claims) => {
        const token = this.auth.token();
        if (token && claims) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        return next.handle(request);
      })
    );
  }
}
