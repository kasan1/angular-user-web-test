import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmUristComponent } from './bpm-urist.component';

describe('BpmUristComponent', () => {
  let component: BpmUristComponent;
  let fixture: ComponentFixture<BpmUristComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmUristComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmUristComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
