import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkapsLizingEditDialogComponent } from './okaps-lizing-edit-dialog.component';

describe('OkapsLizingEditDialogComponent', () => {
  let component: OkapsLizingEditDialogComponent;
  let fixture: ComponentFixture<OkapsLizingEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OkapsLizingEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkapsLizingEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
