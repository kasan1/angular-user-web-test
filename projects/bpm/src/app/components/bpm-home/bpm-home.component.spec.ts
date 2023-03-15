import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmHomeComponent } from './bpm-home.component';

describe('BpmHomeComponent', () => {
  let component: BpmHomeComponent;
  let fixture: ComponentFixture<BpmHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
