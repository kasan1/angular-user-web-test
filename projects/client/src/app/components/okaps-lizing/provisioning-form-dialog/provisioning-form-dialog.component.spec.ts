import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisioningFormDialogComponent } from './provisioning-form-dialog.component';

describe('ProvisioningFormDialogComponent', () => {
  let component: ProvisioningFormDialogComponent;
  let fixture: ComponentFixture<ProvisioningFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisioningFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisioningFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
