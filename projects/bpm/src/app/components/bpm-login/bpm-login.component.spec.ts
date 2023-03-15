import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmLoginComponent } from './bpm-login.component';

describe('BpmLoginComponent', () => {
  let component: BpmLoginComponent;
  let fixture: ComponentFixture<BpmLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
