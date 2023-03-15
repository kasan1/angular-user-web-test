import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffilatedCompaniesDialogFormComponent } from './affilated-companies-dialog-form.component';

describe('AffilatedCompaniesDialogFormComponent', () => {
  let component: AffilatedCompaniesDialogFormComponent;
  let fixture: ComponentFixture<AffilatedCompaniesDialogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffilatedCompaniesDialogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffilatedCompaniesDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
