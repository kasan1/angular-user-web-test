import { BpmAuthService } from '../../services/auth.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { PayloadAction } from '@reduxjs/toolkit';
import { Injectable } from '@angular/core';
import { bpmAuthActions } from '../auth';
import { of } from 'rxjs';
import { ILoginPayload } from '../payloads/auth.payload';

@Injectable()
export class BpmAuthEffects {
  constructor(private actions$: Actions, private service: BpmAuthService) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadAction<ILoginPayload>>(this.login.type),
      switchMap(({ payload }) =>
        this.service.login(payload).pipe(
          map((user) => this.loggedIn(user)),
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
      map(() => {
        return this.loggedIn(this.service.loadFromStorage());
      })
    )
  );

  private get login() {
    return bpmAuthActions.login;
  }

  private get logout() {
    return bpmAuthActions.logout;
  }

  private get loadFromStorage() {
    return bpmAuthActions.loadFromStorage;
  }

  private get loggedIn() {
    return bpmAuthActions.loggedIn;
  }

  private get loggedOut() {
    return bpmAuthActions.loggedOut;
  }

  private get loginFailure() {
    return bpmAuthActions.loginFailure;
  }
}
