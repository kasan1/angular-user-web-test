import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmApplicationBaseComponent } from './bpm-application-base.component';

describe('BpmApplicationBaseComponent', () => {
  let component: BpmApplicationBaseComponent;
  let fixture: ComponentFixture<BpmApplicationBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmApplicationBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmApplicationBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
