import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditHistoryTableComponent } from './credit-history-table.component';

describe('CreditHistoryTableComponent', () => {
  let component: CreditHistoryTableComponent;
  let fixture: ComponentFixture<CreditHistoryTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditHistoryTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
