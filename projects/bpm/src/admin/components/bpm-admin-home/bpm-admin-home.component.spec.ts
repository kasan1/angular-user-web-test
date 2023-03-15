import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmAdminHomeComponent } from './bpm-admin-home.component';

describe('BpmAdminHomeComponent', () => {
  let component: BpmAdminHomeComponent;
  let fixture: ComponentFixture<BpmAdminHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmAdminHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmAdminHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
