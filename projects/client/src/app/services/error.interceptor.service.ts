import { Injectable } from '@angular/core';
import { OkapsAuthService } from './auth.service';
import { okapsAuthActions } from '../store/auth';
import { ServiceLocator } from '../models/locator';
import { ErrorInterceptor } from 'projects/shared/models/errorInterceptor';

@Injectable({ providedIn: 'root' })
export class OkapsErrorInterceptor extends ErrorInterceptor {
  constructor(auth: OkapsAuthService) {
    super(auth, okapsAuthActions.logout, ServiceLocator.injector);
  }
}
