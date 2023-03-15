import { Injectable } from '@angular/core';
import { BpmAuthService } from './auth.service';
import { bpmAuthSelectors } from '../store/selectors/auth.selectors';
import { bpmAuthActions } from '../store/auth';
import { ServiceLocator } from '../models/locator';
import { AuthGuard } from 'projects/shared/models/authGuard';

@Injectable({ providedIn: 'root' })
export class BpmAuthGuard extends AuthGuard {
  constructor(auth: BpmAuthService) {
    super(
      auth,
      bpmAuthSelectors.selectUserOnce,
      bpmAuthActions.logout,
      ServiceLocator.injector
    );
  }
}
