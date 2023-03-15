import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmPledgeBossComponent } from './bpm-pledge-boss.component';

describe('BpmPledgeBossComponent', () => {
  let component: BpmPledgeBossComponent;
  let fixture: ComponentFixture<BpmPledgeBossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmPledgeBossComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmPledgeBossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
