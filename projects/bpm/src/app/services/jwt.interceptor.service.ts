import { BpmAuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { bpmAuthSelectors } from '../store/selectors/auth.selectors';
import { ServiceLocator } from '../models/locator';
import { JwtInterceptor } from 'projects/shared/models/jwtInterceptor';

@Injectable({ providedIn: 'root' })
export class BpmJwtInterceptor extends JwtInterceptor {
  constructor(auth: BpmAuthService) {
    super(auth, bpmAuthSelectors.selectUserOnce, ServiceLocator.injector);
  }
}
