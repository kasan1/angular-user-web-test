import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmHoldingDialogComponent } from './bpm-holding-dialog.component';

describe('BpmHoldingDialogComponent', () => {
  let component: BpmHoldingDialogComponent;
  let fixture: ComponentFixture<BpmHoldingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmHoldingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmHoldingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
