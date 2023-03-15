import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensesDialogFormComponent } from './licenses-dialog-form.component';

describe('LicensesDialogFormComponent', () => {
  let component: LicensesDialogFormComponent;
  let fixture: ComponentFixture<LicensesDialogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicensesDialogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensesDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
