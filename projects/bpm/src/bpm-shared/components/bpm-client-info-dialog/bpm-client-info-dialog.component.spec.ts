import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmClientInfoDialogComponent } from './bpm-client-info-dialog.component';

describe('BpmClientInfoDialogComponent', () => {
  let component: BpmClientInfoDialogComponent;
  let fixture: ComponentFixture<BpmClientInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmClientInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmClientInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
