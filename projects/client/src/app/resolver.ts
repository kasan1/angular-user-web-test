import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { OkapsClientProfileService } from './services/client-profile.service';

@Injectable()
export class Resolver implements Resolve<any> {
  loanId;
  private subscription: Subscription;

  constructor(
    private api: OkapsClientProfileService,
    private activateRoute: ActivatedRoute
  ) {
    this.subscription = activateRoute.params.subscribe(
      (params) => (this.loanId = params['id'])
    );
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.api.GetAppTechsByAppLoanId(route.paramMap.get('id'));
  }
}
