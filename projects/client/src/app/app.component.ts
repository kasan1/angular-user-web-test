import { Component, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { ServiceLocator } from './models/locator';
import { MatDrawer } from '@angular/material/sidenav';
import { Store, select } from '@ngrx/store';
import { IOkapsAppState } from './store/okaps';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { IOkapsUser } from './models/user.model';
import { okapsAuthActions } from './store/auth';
import { okapsAuthSelectors } from './store/selectors/auth.selectors';
import { map } from 'rxjs/operators';
import { fadeInOutTrigger } from 'projects/shared/util/triggers';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeInOutTrigger],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('drawer', { read: MatDrawer }) drawer: MatDrawer;
  year: number = new Date().getFullYear();

  constructor(
    private store: Store<IOkapsAppState>,
    private router: Router,
    injector: Injector
  ) {
    ServiceLocator.injector = injector;
  }

  user$: Observable<IOkapsUser>;

  ngOnInit() {
    registerLocaleData(localeRu, 'ru');

    this.store.dispatch(okapsAuthActions.loadFromStorage());
    this.user$ = this.store.pipe(select(okapsAuthSelectors.selectUser));
  }

  ngAfterViewInit() {
    this.router.events
      .pipe(
        map((e) => {
          if (e instanceof NavigationEnd) this.drawer.close();
        })
      )
      .subscribe();
  }
}
