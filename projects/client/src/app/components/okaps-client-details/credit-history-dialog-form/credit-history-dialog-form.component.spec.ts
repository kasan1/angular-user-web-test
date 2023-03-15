import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditHistoryDialogFormComponent } from './credit-history-dialog-form.component';

describe('CreditHistoryDialogFormComponent', () => {
  let component: CreditHistoryDialogFormComponent;
  let fixture: ComponentFixture<CreditHistoryDialogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditHistoryDialogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditHistoryDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
