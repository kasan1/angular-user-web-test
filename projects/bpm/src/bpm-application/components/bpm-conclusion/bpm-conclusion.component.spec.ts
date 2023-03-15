import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmConclusionComponent } from './bpm-conclusion.component';

describe('BpmConclusionComponent', () => {
  let component: BpmConclusionComponent;
  let fixture: ComponentFixture<BpmConclusionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmConclusionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmConclusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
