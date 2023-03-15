import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmApplicationListComponent } from './bpm-application-list.component';

describe('BpmApplicationListComponent', () => {
  let component: BpmApplicationListComponent;
  let fixture: ComponentFixture<BpmApplicationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmApplicationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
