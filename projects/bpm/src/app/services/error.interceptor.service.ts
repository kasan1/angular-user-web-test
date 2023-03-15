import { Injectable } from '@angular/core';
import { bpmAuthActions } from '../store/auth';
import { ServiceLocator } from '../models/locator';
import { ErrorInterceptor } from 'projects/shared/models/errorInterceptor';
import { BpmAuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class BpmErrorInterceptor extends ErrorInterceptor {
  constructor(auth: BpmAuthService) {
    super(auth, bpmAuthActions.logout, ServiceLocator.injector);
  }
}
