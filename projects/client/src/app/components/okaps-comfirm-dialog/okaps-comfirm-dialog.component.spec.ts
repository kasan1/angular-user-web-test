import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkapsComfirmDialogComponent } from './okaps-comfirm-dialog.component';

describe('OkapsComfirmDialogComponent', () => {
  let component: OkapsComfirmDialogComponent;
  let fixture: ComponentFixture<OkapsComfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OkapsComfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkapsComfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
