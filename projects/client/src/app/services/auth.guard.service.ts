import { Injectable } from '@angular/core';
import { OkapsAuthService } from './auth.service';
import { okapsAuthSelectors } from '../store/selectors/auth.selectors';
import { okapsAuthActions } from '../store/auth';
import { ServiceLocator } from '../models/locator';
import { AuthGuard } from 'projects/shared/models/authGuard';

@Injectable({ providedIn: 'root' })
export class OkapsAuthGuard extends AuthGuard {
  constructor(auth: OkapsAuthService) {
    super(
      auth,
      okapsAuthSelectors.selectClaimsOnce,
      okapsAuthActions.logout,
      ServiceLocator.injector
    );
  }
}
