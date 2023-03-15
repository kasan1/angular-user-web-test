import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmHoldingsComponent } from './bpm-holdings.component';

describe('BpmHoldingsComponent', () => {
  let component: BpmHoldingsComponent;
  let fixture: ComponentFixture<BpmHoldingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmHoldingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmHoldingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
