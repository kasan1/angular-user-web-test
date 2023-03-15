import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VatCertificateDialogFormComponent } from './vat-certificate-dialog-form.component';

describe('VatCertificateDialogFormComponent', () => {
  let component: VatCertificateDialogFormComponent;
  let fixture: ComponentFixture<VatCertificateDialogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VatCertificateDialogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VatCertificateDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
