import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandAssetsDialogFormComponent } from './land-assets-dialog-form.component';

describe('LandAssetsDialogFormComponent', () => {
  let component: LandAssetsDialogFormComponent;
  let fixture: ComponentFixture<LandAssetsDialogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandAssetsDialogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandAssetsDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
