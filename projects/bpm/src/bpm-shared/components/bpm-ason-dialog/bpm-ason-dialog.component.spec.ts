import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmAsonDialogComponent } from './bpm-ason-dialog.component';

describe('BpmAsonDialogComponent', () => {
  let component: BpmAsonDialogComponent;
  let fixture: ComponentFixture<BpmAsonDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmAsonDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmAsonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
