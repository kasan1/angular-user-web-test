import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Store, Action } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IAuthService } from './auth';
import { Observable } from 'rxjs';
import { Injector } from '@angular/core';

export class AuthGuard implements CanActivate {
  constructor(
    protected auth: IAuthService,
    private selectClaimsOnce: (store: Store) => Observable<any>,
    private logout: () => Action,
    protected injector: Injector
  ) {
    this.store = injector.get(Store);
    this.router = injector.get(Router);
    this.snackbar = injector.get(MatSnackBar);
  }

  protected store: Store;
  protected snackbar: MatSnackBar;
  protected router: Router;
  protected unauthorizedUrl = '/unauthorized';

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.selectClaimsOnce(this.store).pipe(
      map((claims) => {
        if (!claims || !this.auth.token()) {
          this.store.dispatch(this.logout());
          this.router.navigate([this.unauthorizedUrl], {
            queryParams: { returnUrl: state.url },
          });
          this.snackbar.open('Нет доступа к данной странице', null, {
            duration: 3000,
          });
          return false;
        }

        return true;
      })
    );
  }
}
