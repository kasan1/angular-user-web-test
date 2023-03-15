import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmPledgeComponent } from './bpm-pledge.component';

describe('BpmPledgeComponent', () => {
  let component: BpmPledgeComponent;
  let fixture: ComponentFixture<BpmPledgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmPledgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmPledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
