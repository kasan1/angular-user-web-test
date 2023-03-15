import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmAdminRegisterComponent } from './bpm-admin-register.component';

describe('BpmAdminRegisterComponent', () => {
  let component: BpmAdminRegisterComponent;
  let fixture: ComponentFixture<BpmAdminRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BpmAdminRegisterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmAdminRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
