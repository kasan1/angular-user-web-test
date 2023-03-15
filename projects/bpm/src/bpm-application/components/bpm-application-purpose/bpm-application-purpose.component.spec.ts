import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmApplicationPurposeComponent } from './bpm-application-purpose.component';

describe('BpmApplicationPurposeComponent', () => {
  let component: BpmApplicationPurposeComponent;
  let fixture: ComponentFixture<BpmApplicationPurposeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmApplicationPurposeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmApplicationPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
