import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmUnauthorizedComponent } from './bpm-unauthorized.component';

describe('BpmUnauthorizedComponent', () => {
  let component: BpmUnauthorizedComponent;
  let fixture: ComponentFixture<BpmUnauthorizedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmUnauthorizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmUnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
