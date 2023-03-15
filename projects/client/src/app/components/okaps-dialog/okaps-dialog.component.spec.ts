import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkapsDialogComponent } from './okaps-dialog.component';

describe('OkapsDialogComponent', () => {
  let component: OkapsDialogComponent;
  let fixture: ComponentFixture<OkapsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OkapsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkapsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
