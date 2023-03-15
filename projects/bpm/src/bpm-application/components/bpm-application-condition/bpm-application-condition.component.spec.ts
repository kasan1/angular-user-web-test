import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmApplicationConditionComponent } from './bpm-application-condition.component';

describe('BpmApplicationConditionComponent', () => {
  let component: BpmApplicationConditionComponent;
  let fixture: ComponentFixture<BpmApplicationConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmApplicationConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmApplicationConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
