import {
  HttpRequest,
  HttpInterceptor,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Subject, Observable, empty, throwError } from 'rxjs';
import { Store, Action } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IAuthService, ITokenResult } from './auth';
import { Router } from '@angular/router';
import { switchMap, catchError, take } from 'rxjs/operators';
import { Injector } from '@angular/core';

export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    protected auth: IAuthService,
    private logout: () => Action,
    protected injector: Injector
  ) {
    this.store = injector.get(Store);
    this.router = injector.get(Router);
    this.snackbar = injector.get(MatSnackBar);
  }

  private _signal$ = new Subject<{ accessToken: string }>();
  protected store: Store;
  protected snackbar: MatSnackBar;
  protected router: Router;
  protected unauthorizedUrl = '/unauthorized';
  protected snackbarLifeTime = 7000;

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(err);
        }

        const { status, error, headers } = err;

        switch (status) {
          case 500:
            this.snackbar.open(messages.internalServer, 'Продолжить', {
              duration: this.snackbarLifeTime,
            });
            break;

          case 400:
            const message =
              'Message' in error ? error.Message : messages.badRequest;

            this.snackbar.open(message, 'Продолжить', {
              duration: this.snackbarLifeTime,
            });

            return throwError(err);

          case 401:
            const tokenExpired = headers.get('X-Token-Expired');
            if (tokenExpired === 'true')
              return this.auth
                .exchangeRefreshToken()
                .pipe(
                  switchMap((r) => this.handleExchangeResult(r, request, next))
                );
            else {
              this.snackbar.open(messages.unauthorized, null, {
                duration: this.snackbarLifeTime,
              });
              this.router.navigate(['/']);
              return empty();
            }

          case 403:
            return this.tokenExpired();
        }

        return throwError(err);
      })
    );
  }

  private handleExchangeResult = (
    result: ITokenResult | boolean,
    request: HttpRequest<any>,
    next: HttpHandler
  ) => {
    if (typeof result === 'boolean' && !result)
      return this._signal$.pipe(
        take(1),
        switchMap((signal) => {
          if (signal && signal.accessToken) {
            request = this.cloneRequestWith(request, signal.accessToken);
            return next.handle(request);
          }

          return empty();
        })
      );

    if (typeof result === 'object' && result) {
      const { accessToken } = result;
      this._signal$.next({ accessToken });

      request = this.cloneRequestWith(request, accessToken);
      return next.handle(request);
    }

    this._signal$.next(null);
    return this.tokenExpired();
  };

  private cloneRequestWith = (request: HttpRequest<any>, accessToken: string) =>
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

  private tokenExpired = () => {
    this.snackbar.open(messages.tokenExpired, null, {
      duration: this.snackbarLifeTime,
    });
    this.store.dispatch(this.logout());
    this.router.navigate([this.unauthorizedUrl]);
    return empty();
  };
}

const messages = {
  internalServer: 'Возникла непредвиденная ошибка.',
  badRequest: 'Проверьте правильность заполненных данных',
  unauthorized: 'Нет доступа к данному ресурсу',
  tokenExpired: 'Ваша сессия закончилась',
};
