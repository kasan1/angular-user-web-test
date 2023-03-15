import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { OkapsNavigationComponent } from './okaps-navigation.component';
import { OkapsHomeComponent } from '../okaps-home/okaps-home.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StoreModule, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { OkapsLocaleService } from '../../services/locale.service';

describe('OkapsNavigationComponent', () => {
  let component: OkapsNavigationComponent;
  let fixture: ComponentFixture<OkapsNavigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'okaps',
            component: OkapsHomeComponent,
          },
        ]),
        HttpClientModule,
        MatDialogModule,
        MatSnackBarModule,
        StoreModule.forRoot([]),
      ],
      declarations: [OkapsNavigationComponent],
      providers: [OkapsLocaleService],
    });

    fixture = TestBed.createComponent(OkapsNavigationComponent);
    component = fixture.componentInstance;
  });

  describe('locale', () => {
    let service: OkapsLocaleService;

    beforeEach(() => {
      service = TestBed.inject(OkapsLocaleService);
    });

    it('should track current locale', () => {
      spyOn(service, 'valueChanges').and.returnValue(of('ru'));

      let locale = '';
      component.ngOnInit();
      component.currentLocale$.subscribe((x) => (locale = x));

      expect(locale).toBe('ru');
    });

    it('should switch locale when switchLocale is called', () => {
      let locale = '';
      spyOn(service, 'switchLocale').and.callFake((x) => (locale = x));

      component.switchLocale({ source: null, value: 'kz' });
      expect(locale).toBe('kz');

      component.switchLocale({ source: null, value: 'ru' });
      expect(locale).toBe('ru');
    });
  });

  describe('logout', () => {
    it('should dispatch a logout action when called', async(() => {
      let service = TestBed.inject(Store);
      let spy = spyOn(service, 'dispatch');

      fixture.ngZone.run(() => {
        component.logout();

        fixture.whenStable().then(() => {
          expect(spy).toHaveBeenCalled();
        });
      });
    }));

    it('should navigate to / route', async(() => {
      let service = TestBed.inject(Router);
      let spy = spyOn(service, 'navigate');

      fixture.ngZone.run(() => {
        component.logout();

        fixture.whenStable().then(() => {
          expect(spy).toHaveBeenCalledWith(['/']);
        });
      });
    }));
  });
});
