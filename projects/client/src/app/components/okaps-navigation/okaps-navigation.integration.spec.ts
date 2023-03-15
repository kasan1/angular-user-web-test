import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OkapsNavigationComponent } from './okaps-navigation.component';
import { OkapsRegisterComponent } from '../okaps-register/okaps-register.component';
import { OkapsLocaleService } from '../../services/locale.service';

describe('OkapsNavigationComponent', () => {
  let component: OkapsNavigationComponent;
  let fixture: ComponentFixture<OkapsNavigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OkapsNavigationComponent],
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        MatDialogModule,
        RouterTestingModule,
        StoreModule.forRoot([]),
      ],
      providers: [OkapsLocaleService],
    });

    fixture = TestBed.createComponent(OkapsNavigationComponent);
    component = fixture.componentInstance;
  });

  xit('should open a register dialog when register button is clicked', () => {
    let service = TestBed.inject(MatDialog);
    let spy = spyOn(service, 'open');

    fixture.detectChanges();

    let button = (fixture.debugElement
      .nativeElement as HTMLElement).querySelector(
      '#register'
    ) as HTMLButtonElement;
    button.click();

    expect(button).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(OkapsRegisterComponent);
  });
});
