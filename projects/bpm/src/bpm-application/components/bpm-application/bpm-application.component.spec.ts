import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmCreditManagerComponent } from './bpm-credit-manager.component';

describe('BpmCreditManagerComponent', () => {
  let component: BpmCreditManagerComponent;
  let fixture: ComponentFixture<BpmCreditManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmCreditManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmCreditManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
