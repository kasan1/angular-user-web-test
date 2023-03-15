import { Component, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { ServiceLocator } from './models/locator';
import { MatDrawer } from '@angular/material/sidenav';
import { Store, select } from '@ngrx/store';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { IBpmUser } from './models/bpm-user';
import { bpmAuthActions } from './store/auth';
import { bpmAuthSelectors } from './store/selectors/auth.selectors';
import { map } from 'rxjs/operators';
import { fadeInOutTrigger } from 'projects/shared/util/triggers';
import { IBpmAppState } from './store/bpm';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeInOutTrigger],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('drawer', { read: MatDrawer }) drawer: MatDrawer;

  constructor(
    private store: Store<IBpmAppState>,
    private router: Router,
    injector: Injector
  ) {
    ServiceLocator.injector = injector;
  }

  user$: Observable<IBpmUser>;

  ngOnInit() {
    this.store.dispatch(bpmAuthActions.loadFromStorage());
    this.user$ = this.store.pipe(select(bpmAuthSelectors.selectUser));
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
