import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LazyBpmAdminRegisterComponent } from './bpm-admin-register.component';

describe('BpmAdminRegisterComponent', () => {
  let component: LazyBpmAdminRegisterComponent;
  let fixture: ComponentFixture<LazyBpmAdminRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LazyBpmAdminRegisterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LazyBpmAdminRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
