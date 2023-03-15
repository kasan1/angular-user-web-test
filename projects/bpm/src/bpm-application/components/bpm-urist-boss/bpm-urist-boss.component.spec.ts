import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmUristBossComponent } from './bpm-urist-boss.component';

describe('BpmUristBossComponent', () => {
  let component: BpmUristBossComponent;
  let fixture: ComponentFixture<BpmUristBossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmUristBossComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmUristBossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
