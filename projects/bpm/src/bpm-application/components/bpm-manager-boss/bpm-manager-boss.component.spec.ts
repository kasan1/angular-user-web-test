import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmManagerBossComponent } from './bpm-manager-boss.component';

describe('BpmManagerBossComponent', () => {
  let component: BpmManagerBossComponent;
  let fixture: ComponentFixture<BpmManagerBossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmManagerBossComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmManagerBossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
