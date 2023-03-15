import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { IBpmAppState } from '../../store/bpm';
import { BpmLocaleService } from '../../services/locale.service';
import { bpmAuthSelectors } from '../../store/selectors/auth.selectors';
import { bpmAuthActions } from '../../store/auth';
import { fadeInTrigger } from 'projects/shared/util/triggers';
import { BpmLoginComponent } from '../bpm-login/bpm-login.component';
import { IBpmUser } from '../../models/bpm-user';
import { LocaleSignal } from 'projects/shared/services/locale.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-bpm-navigation',
  templateUrl: './bpm-navigation.component.html',
  styleUrls: ['./bpm-navigation.component.scss'],
  animations: [fadeInTrigger],
})
export class BpmNavigationComponent implements OnInit {
  items = [
    { to: '/', text: 'Главная страница' },
    {
      to: '/applicationList',
      text: 'Заявки',
    },
  ];
  user$: Observable<IBpmUser>;
  locale$: Observable<any>;
  currentLocale$: Observable<string>;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private store: Store<IBpmAppState>,
    private locale: BpmLocaleService
  ) {}

  ngOnInit(): void {
    this.user$ = this.store.pipe(select(bpmAuthSelectors.selectUser));
    this.locale$ = this.locale.navigation().pipe(
      map((x) => {
        this.items[0].text = x['homePage'];
        return x;
      })
    );
    this.currentLocale$ = LocaleSignal.signal$;
  }

  login = () => {
    this.dialog.open(BpmLoginComponent, {
      hasBackdrop: true,
      autoFocus: true,
      panelClass: ['d-lg', 'sm-lg', 'md-md', 'lg-sm', 'xl-sm'],
    });
  };

  logout = () => {
    this.store.dispatch(bpmAuthActions.logout());
    this.snackbar.open('Выход из системы', null, { duration: 1000 });
    this.router.navigate(['/']);
  };

  switchLocale = (event: MatButtonToggleChange) =>
    this.locale.switchLocale(event.value);
}
