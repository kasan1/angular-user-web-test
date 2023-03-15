import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkapsLizingMessageDialogComponent } from './okaps-lizing-message-dialog.component';

describe('OkapsLizingMessageDialogComponent', () => {
  let component: OkapsLizingMessageDialogComponent;
  let fixture: ComponentFixture<OkapsLizingMessageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OkapsLizingMessageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkapsLizingMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
