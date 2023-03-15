import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmClientComponent } from './bpm-client.component';

describe('BpmClientComponent', () => {
  let component: BpmClientComponent;
  let fixture: ComponentFixture<BpmClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
