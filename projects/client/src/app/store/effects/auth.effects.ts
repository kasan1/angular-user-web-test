import { OkapsAuthService } from '../../services/auth.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap, mergeMap } from 'rxjs/operators';
import { PayloadAction } from '@reduxjs/toolkit';
import { Injectable } from '@angular/core';
import { okapsAuthActions } from '../auth';
import { of } from 'rxjs';
import { ILoginPayload } from '../payloads/auth.payload';
import { IOkapsAppState } from '../okaps';
import { ITokenClaims } from '../../models/user.model';

@Injectable()
export class OkapsAuthEffects {
  constructor(private actions$: Actions, private service: OkapsAuthService) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadAction<ILoginPayload>>(this.login.type),
      switchMap(({ payload }) =>
        this.service.login(payload).pipe(
          mergeMap((claims) => {
            return [this.loggedIn(claims), this.loadProfile(claims)];
          }),
          catchError(() => of(this.loginFailure()))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.logout.type),
      map(() => {
        this.service.logout();
        return this.loggedOut();
      })
    )
  );

  loadFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.loadFromStorage.type),
      mergeMap(() => {
        const claims = this.service.loadFromStorage();
        return [this.loggedIn(claims), this.loadProfile(claims)];
      })
    )
  );

  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadAction<ITokenClaims>>(this.loadProfile.type),
      switchMap(({ payload }) => {
        if (!!payload) {
          return this.service.getProfile().pipe(
            map((user) => {
              return this.setProfile(user.data);
            })
          );
        }
        return of(this.setProfile(null));
      })
    )
  );

  private get login() {
    return okapsAuthActions.login;
  }

  private get logout() {
    return okapsAuthActions.logout;
  }

  private get loadFromStorage() {
    return okapsAuthActions.loadFromStorage;
  }

  private get loggedIn() {
    return okapsAuthActions.loggedIn;
  }

  private get loggedOut() {
    return okapsAuthActions.loggedOut;
  }

  private get loginFailure() {
    return okapsAuthActions.loginFailure;
  }

  private get loadProfile() {
    return okapsAuthActions.loadProfile;
  }

  private get setProfile() {
    return okapsAuthActions.setProfile;
  }
}
