import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffilatedCompaniesTableComponent } from './affilated-companies-table.component';

describe('AffilatedCompaniesTableComponent', () => {
  let component: AffilatedCompaniesTableComponent;
  let fixture: ComponentFixture<AffilatedCompaniesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffilatedCompaniesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffilatedCompaniesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
