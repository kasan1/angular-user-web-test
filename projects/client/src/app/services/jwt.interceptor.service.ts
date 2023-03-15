import { OkapsAuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { okapsAuthSelectors } from '../store/selectors/auth.selectors';
import { ServiceLocator } from '../models/locator';
import { JwtInterceptor } from 'projects/shared/models/jwtInterceptor';

@Injectable({ providedIn: 'root' })
export class OkapsJwtInterceptor extends JwtInterceptor {
  constructor(auth: OkapsAuthService) {
    super(auth, okapsAuthSelectors.selectClaimsOnce, ServiceLocator.injector);
  }
}
