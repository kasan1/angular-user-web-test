import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensesTableComponent } from './licenses-table.component';

describe('LicensesTableComponent', () => {
  let component: LicensesTableComponent;
  let fixture: ComponentFixture<LicensesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicensesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
