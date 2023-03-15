import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmNavigationComponent } from './bpm-navigation.component';

describe('BpmNavigationComponent', () => {
  let component: BpmNavigationComponent;
  let fixture: ComponentFixture<BpmNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
