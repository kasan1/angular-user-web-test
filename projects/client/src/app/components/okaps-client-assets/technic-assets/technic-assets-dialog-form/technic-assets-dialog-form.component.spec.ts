import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicAssetsDialogFormComponent } from './technic-assets-dialog-form.component';

describe('TechnicAssetsDialogFormComponent', () => {
  let component: TechnicAssetsDialogFormComponent;
  let fixture: ComponentFixture<TechnicAssetsDialogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicAssetsDialogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicAssetsDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
