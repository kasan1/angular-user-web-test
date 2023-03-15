import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmApplicationInworkComponent } from './bpm-application-inwork.component';

describe('BpmApplicationInworkComponent', () => {
  let component: BpmApplicationInworkComponent;
  let fixture: ComponentFixture<BpmApplicationInworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmApplicationInworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmApplicationInworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
