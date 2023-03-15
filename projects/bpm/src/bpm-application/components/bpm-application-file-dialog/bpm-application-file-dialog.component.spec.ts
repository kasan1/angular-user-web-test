import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmApplicationFileDialogComponent } from './bpm-application-file-dialog.component';

describe('BpmApplicationFileDialogComponent', () => {
  let component: BpmApplicationFileDialogComponent;
  let fixture: ComponentFixture<BpmApplicationFileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmApplicationFileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmApplicationFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
