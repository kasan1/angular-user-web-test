import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { OkapsLoginComponent } from '../okaps-login/okaps-login.component';
import { IOkapsAppState } from '../../store/okaps';
import { OkapsLocaleService } from '../../services/locale.service';
import { okapsAuthSelectors } from '../../store/selectors/auth.selectors';
import { okapsAuthActions } from '../../store/auth';
import { IOkapsUser } from '../../models/user.model';
import { fadeInTrigger } from 'projects/shared/util/triggers';
import { LocaleSignal } from 'projects/shared/services/locale.service';
import { OkapsDialogComponent } from '../okaps-dialog/okaps-dialog.component';
import { OkapsLazyLoaderService } from '../../services/lazy-loader.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-okaps-navigation',
  templateUrl: './okaps-navigation.component.html',
  styleUrls: ['./okaps-navigation.component.scss'],
  animations: [fadeInTrigger],
})
export class OkapsNavigationComponent implements OnInit {
  user$: Observable<IOkapsUser>;
  locale$: Observable<any>;
  currentLocale$: Observable<string>;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private store: Store<IOkapsAppState>,
    private locale: OkapsLocaleService,
    private loader: OkapsLazyLoaderService
  ) {}

  ngOnInit(): void {
    this.user$ = this.store.pipe(select(okapsAuthSelectors.selectUser));
    this.locale$ = this.locale.navigation().pipe(map((x) => x));
    this.currentLocale$ = LocaleSignal.signal$;
  }

  register = () => {
    this.dialog.open(OkapsDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      autoFocus: false,
      panelClass: ['d-lg', 'sm-lg', 'md-lg', 'lg-md'],
      data: {
        method: this.loader.loadOkapsRegisterComponent,
      },
    });
  };

  login = () => {
    this.router.navigate(['/unauthorized']);
  };

  logout = () => {
    this.store.dispatch(okapsAuthActions.logout());
    this.snackbar.open('Выход из системы', null, { duration: 1000 });
    this.router.navigate(['/']);
  };

  switchLocale = (event: MatButtonToggleChange) =>
    this.locale.switchLocale(event.value);
}
