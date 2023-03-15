import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmApplicationReworkComponent } from './bpm-application-rework.component';

describe("BpmApplicationReworkComponent", () => {
  let component: BpmApplicationReworkComponent;
  let fixture: ComponentFixture<BpmApplicationReworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmApplicationReworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmApplicationReworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
