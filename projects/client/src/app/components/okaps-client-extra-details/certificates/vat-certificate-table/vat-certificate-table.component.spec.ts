import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VatCertificateTableComponent } from './vat-certificate-table.component';

describe('VatCertificateTableComponent', () => {
  let component: VatCertificateTableComponent;
  let fixture: ComponentFixture<VatCertificateTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VatCertificateTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VatCertificateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
